---
title: AWS CloudWatch Logging with Fluent Bit on Kubernetes
layout: default
parent: Kubernetes Projects
nav_order: 15
permalink: /docs/devops/kubernetes/eks-logs-into-cloudwatch-using-fluentbit/
description: Documentation on AWS CloudWatch Logging with Fluent Bit on Kubernetes.
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS CloudWatch Logging with Fluent Bit on Kubernetes | Jatin Sharma</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        /* Root variables for theming - Aligned with About Me and Contact Me pages */
        :root {
            --primary-color: #ffb347; /* Orange/Yellow accent */
            --light-primary-shade: #ffd97d; /* Lighter shade of primary-color for gradients */
            --bg-dark: #1e1f26; /* Dark background */
            --text-dark: #e0e0e0; /* Light text for dark mode */
            --card-bg-dark: rgba(25, 25, 34, 0.7); /* Base card background */
            --section-bg-dark: rgba(25, 25, 34, 0.6); /* Section background */
            --code-bg-dark: rgba(13, 13, 16, 0.7); /* Code block background */
            
            /* Accent colors for headings/borders, harmonized across pages */
            --accent-purple: #9c27b0; 
            --accent-pink: #ff0080;
        }

        body {
            background-color: #070708; /* Dark background for contrast */
            color: var(--text-dark); /* Using root text-dark for consistency */
            font-family: 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 0;
            text-align: center;
            line-height: 1.6;
            min-height: 100vh;
            background-image: radial-gradient(circle at top left, #2f0a5d 0%, transparent 50%),
                              radial-gradient(circle at bottom right, #004d40 0%, transparent 50%); /* Subtle background gradients */
            background-blend-mode: screen;
        }

        /* Animated gradient text style for main headings */
        .welcome-gradient {
            background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color));
            background-size: 600% 600%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientMove 8s ease infinite;
            margin-bottom: 0.5em;
            font-size: 2.7em;
            font-weight: bold;
            text-align: center;
            text-shadow: 0 0 10px rgba(0, 198, 255, 0.3);
        }
        @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Main Content Container - Glass Effect */
        .container {
            max-width: 900px;
            margin: 40px auto; 
            padding: 40px 20px;
            border-radius: 15px;
            background-color: var(--card-bg-dark); 
            backdrop-filter: blur(15px) saturate(180%);
            -webkit-backdrop-filter: blur(15px) saturate(180%);
            border: 1px solid rgba(var(--accent-purple), 0.3); 
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            transition: box-shadow 0.3s;
        }
        .container:hover {
            box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.45); 
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 12px;
            font-weight: 700;
            letter-spacing: 0.03rem;
            animation: fadeInUp 1s ease forwards;
            color: var(--primary-color);
        }
        p {
            font-size: 1.1em;
            line-height: 1.7;
            margin-bottom: 1.2em;
            color: var(--text-dark);
            text-align: left; /* Default text alignment for content */
        }
        strong {
            color: var(--primary-color); /* Highlight strong text with primary color */
        }

        /* Section Styling */
        .section {
            background-color: var(--section-bg-dark); 
            backdrop-filter: blur(10px) saturate(150%);
            -webkit-backdrop-filter: blur(10px) saturate(150%);
            padding: 30px;
            border-radius: 12px;
            margin-top: 40px;
            border: 1px solid rgba(var(--accent-purple), 0.2); 
            box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.25);
            text-align: left; /* Align section content left */
        }
        .section h2 {
            color: var(--primary-color);
            margin-bottom: 25px;
            text-align: center;
            font-size: 2.2em;
            letter-spacing: 2px;
            text-shadow: 0 0 8px rgba(var(--primary-color), 0.2);
            display: flex; /* For icon alignment */
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        .section h2 i {
            font-size: 1.1em;
            color: var(--accent-pink);
            text-shadow: 0 0 5px rgba(var(--accent-pink), 0.2);
        }

        .section h3 {
            color: var(--accent-purple);
            margin-top: 25px;
            margin-bottom: 15px;
            font-size: 1.5em;
            font-weight: 600;
            text-align: left; /* Align sub-headings left */
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Code Block Styling */
        pre {
            background-color: var(--code-bg-dark);
            color: #d1d1d1;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
            font-size: 0.9em;
            line-height: 1.4;
            margin-top: 20px;
            margin-bottom: 20px;
            border: 1px solid rgba(var(--primary-color), 0.2);
            box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3);
            text-align: left;
        }
        code {
            font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
            background-color: rgba(var(--primary-color), 0.1);
            padding: 2px 4px;
            border-radius: 4px;
            color: var(--primary-color);
        }

        /* Table Styling */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: var(--code-bg-dark);
            border-radius: 8px;
            overflow: hidden; /* Ensures rounded corners on content */
            box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3);
        }
        th, td {
            padding: 12px 15px;
            border: 1px solid rgba(var(--accent-purple), 0.2);
            text-align: left;
            color: var(--text-dark);
        }
        th {
            background-color: rgba(var(--accent-purple), 0.3);
            color: var(--primary-color);
            font-weight: 600;
        }
        tr:nth-child(even) {
            background-color: rgba(var(--accent-purple), 0.1);
        }
        tr:hover {
            background-color: rgba(var(--accent-purple), 0.2);
        }

        /* Horizontal Rule */
        hr {
          border: none;
          border-top: 1px solid rgba(var(--accent-purple), 0.5);
          margin-top: 40px;
          margin-bottom: 20px;
        }

        /* Image styling */
        .content-image {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            margin: 30px auto;
            display: block;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(var(--primary-color), 0.3);
        }

        /* Animations */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .welcome-gradient {
                font-size: 2em;
            }
            .section h2 {
                font-size: 1.8em;
                flex-direction: column;
                gap: 5px;
            }
            .section h3 {
                font-size: 1.3em;
            }
            p {
                font-size: 1em;
            }
            .container {
                margin: 20px 10px;
                padding: 30px 15px;
            }
            .section {
                padding: 20px;
            }
            th, td {
                padding: 8px 10px;
            }
        }
    </style>
</head>
<body class="dark">
    <div class="container">
        <div class="gradient-header" align="center">
            <h1 class="welcome-gradient">📊 AWS CloudWatch Logging with Fluent Bit on Kubernetes</h1>
        </div>

        <p>
            This guide walks you through setting up **Fluent Bit** as a DaemonSet in your **Amazon EKS cluster** to send container, host, and dataplane logs to **AWS CloudWatch Logs**. This ensures robust observability for your Kubernetes workloads.
        </p>

        <hr>

        <section class="section">
            <h2>✨ 1. Create Namespace: <code>amazon-cloudwatch</code></h2>
            <p>First, we need to create a dedicated Kubernetes namespace for our CloudWatch logging components.</p>
            <pre><code># create amazon-cloudwatch namespace
apiVersion: v1
kind: Namespace
metadata:
  name: amazon-cloudwatch
  labels:
    name: amazon-cloudwatch</code></pre>
            <p>Apply this YAML using <code>kubectl apply -f &lt;filename&gt;</code> or directly with <code>kubectl create namespace amazon-cloudwatch</code>.</p>
        </section>

        <hr>

        <section class="section">
            <h2>📝 2. Create ConfigMap: <code>fluent-bit-cluster-info</code></h2>
            <p>Next, we'll create a ConfigMap to store essential cluster-specific information that Fluent Bit will use.</p>
            <pre><code>ClusterName=MillenniumFalcon
RegionName=ap-southeast-1
FluentBitHttpPort='2020'
FluentBitReadFromHead='Off'
[[ ${FluentBitReadFromHead} = 'On' ]] && FluentBitReadFromTail='Off'|| FluentBitReadFromTail='On'
[[ -z ${FluentBitHttpPort} ]] && FluentBitHttpServer='Off' || FluentBitHttpServer='On'
kubectl create configmap fluent-bit-cluster-info \
--from-literal=cluster.name=${ClusterName} \
--from-literal=http.server=${FluentBitHttpServer} \
--from-literal=http.port=${FluentBitHttpPort} \
--from-literal=read.head=${FluentBitReadFromHead} \
--from-literal=read.tail=${FluentBitReadFromTail} \
--from-literal=logs.region=${RegionName} -n amazon-cloudwatch</code></pre>
            <p>
                **Remember to replace `MillenniumFalcon` with your actual EKS cluster name and `ap-southeast-1` with your AWS Region.**
            </p>
        </section>

        <hr>

        <section class="section">
            <h2>📦 3. Deploy Fluent Bit as a DaemonSet to Send Logs</h2>
            <p>To enable Fluent Bit to collect and send logs to CloudWatch, we need to set up appropriate IAM permissions and Kubernetes resources.</p>
            
            <h3>🔑 IAM Role for Service Account (IRSA) Policy</h3>
            <p>Create an IAM policy that allows Fluent Bit to write to CloudWatch Logs. This policy will be associated with a Kubernetes Service Account via **IAM Roles for Service Accounts (IRSA)**.</p>
            <pre><code>{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::&lt;ACCOUNT_ID&gt;:oidc-provider/oidc.eks.ap-southeast-1.amazonaws.com/id/&lt;OIDC_ID&gt;"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "oidc.eks.ap-southeast-1.amazonaws.com/id/&lt;OIDC_ID&gt;:sub": "system:serviceaccount:amazon-cloudwatch:fluent-bit",
                    "oidc.eks.ap-southeast-1.amazonaws.com/id/&lt;OIDC_ID&gt;:aud": "sts.amazonaws.com"
                }
            }
        }
    ]
}</code></pre>
            <p>
                **Important:**
                <ul>
                    <li>Replace <code>&lt;ACCOUNT_ID&gt;</code> with your AWS account ID.</li>
                    <li>Replace <code>&lt;OIDC_ID&gt;</code> with your EKS cluster's OIDC provider ID. You can find this by running <code>aws eks describe-cluster --name your-cluster-name --query "cluster.identity.oidc.issuer" --output text</code> and extracting the ID from the URL.</li>
                </ul>
                Attach the necessary CloudWatch Logs write permissions to this IAM Role. For example, `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`, `logs:DescribeLogGroups`, `logs:DescribeLogStreams`.
            </p>

            <h3>☸️ Kubernetes Manifests (ServiceAccount, ClusterRole, ConfigMap, DaemonSet)</h3>
            <p>Apply the following comprehensive YAML to create the Service Account, ClusterRole, ClusterRoleBinding, a detailed Fluent Bit configuration ConfigMap, and the Fluent Bit DaemonSet itself.</p>
<pre><code>
apiVersion: v1
kind: ServiceAccount
metadata:
  name: fluent-bit
  namespace: amazon-cloudwatch
  annotations: 
    eks.amazonaws.com/role-arn: "arn:aws:iam::&lt;ACCOUNT_ID&gt;:role/LokiServiceAccountRole" # Replace &lt;ACCOUNT_ID&gt; with your AWS Account ID
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: fluent-bit-role
rules:
  - nonResourceURLs:
      - /metrics
    verbs:
      - get
  - apiGroups: [""]
    resources:
      - namespaces
      - pods
      - pods/logs
      - nodes
      - nodes/proxy
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: fluent-bit-role-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: fluent-bit-role
subjects:
  - kind: ServiceAccount
    name: fluent-bit
    namespace: amazon-cloudwatch
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
  namespace: amazon-cloudwatch
  labels:
    k8s-app: fluent-bit
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush                       5
        Grace                       30
        Log_Level                   error
        Daemon                      off
        Parsers_File                parsers.conf
        HTTP_Server                 ${HTTP_SERVER}
        HTTP_Listen                 0.0.0.0
        HTTP_Port                   ${HTTP_PORT}
        storage.path                /var/fluent-bit/state/flb-storage/
        storage.sync                normal
        storage.checksum            off
        storage.backlog.mem_limit   5M

    @INCLUDE application-log.conf
    @INCLUDE dataplane-log.conf
    @INCLUDE host-log.conf

  application-log.conf: |
    [INPUT]
        Name                        tail
        Tag                         application.*
        Exclude_Path                /var/log/containers/cloudwatch-agent*, /var/log/containers/fluent-bit*, /var/log/containers/aws-node*, /var/log/containers/kube-proxy*, /var/log/containers/fluentd*
        Path                        /var/log/containers/*.log
        multiline.parser            docker, cri
        DB                          /var/fluent-bit/state/flb_container.db
        Mem_Buf_Limit               50MB
        Skip_Long_Lines             On
        Refresh_Interval            10
        Rotate_Wait                 30
        storage.type                filesystem
        Read_from_Head              ${READ_FROM_HEAD}

    [INPUT]
        Name                        tail
        Tag                         application.*
        Path                        /var/log/containers/fluent-bit*
        multiline.parser            docker, cri
        DB                          /var/fluent-bit/state/flb_log.db
        Mem_Buf_Limit               5MB
        Skip_Long_Lines             On
        Refresh_Interval            10
        Read_from_Head              ${READ_FROM_HEAD}

    [INPUT]
        Name                        tail
        Tag                         application.*
        Path                        /var/log/containers/cloudwatch-agent*
        multiline.parser            docker, cri
        DB                          /var/fluent-bit/state/flb_cwagent.db
        Mem_Buf_Limit               5MB
        Skip_Long_Lines             On
        Refresh_Interval            10
        Read_from_Head              ${READ_FROM_HEAD}

    [FILTER]
        Name                        kubernetes
        Match                       application.*
        Kube_URL                    https://kubernetes.default.svc:443
        Kube_Tag_Prefix             application.var.log.containers.
        Merge_Log                   On
        Merge_Log_Key               log_processed
        K8S-Logging.Parser          On
        K8S-Logging.Exclude         Off
        Labels                      Off
        Annotations                 Off
        Use_Kubelet                 On
        Kubelet_Port                10250
        Buffer_Size                 0

    [OUTPUT]
        Name                        cloudwatch_logs
        Match                       application.*
        region                      ${AWS_REGION}
        log_group_name              /aws/containerinsights/${CLUSTER_NAME}/application
        log_stream_prefix           ${HOST_NAME}-
        auto_create_group           true
        extra_user_agent            container-insights

  dataplane-log.conf: |
    [INPUT]
        Name                        systemd
        Tag                         dataplane.systemd.*
        Systemd_Filter              _SYSTEMD_UNIT=docker.service
        Systemd_Filter              _SYSTEMD_UNIT=containerd.service
        Systemd_Filter              _SYSTEMD_UNIT=kubelet.service
        DB                          /var/fluent-bit/state/systemd.db
        Path                        /var/log/journal
        Read_From_Tail              ${READ_FROM_TAIL}

    [INPUT]
        Name                        tail
        Tag                         dataplane.tail.*
        Path                        /var/log/containers/aws-node*, /var/log/containers/kube-proxy*
        multiline.parser            docker, cri
        DB                          /var/fluent-bit/state/flb_dataplane_tail.db
        Mem_Buf_Limit               50MB
        Skip_Long_Lines             On
        Refresh_Interval            10
        Rotate_Wait                 30
        storage.type                filesystem
        Read_from_Head              ${READ_FROM_HEAD}

    [FILTER]
        Name                        modify
        Match                       dataplane.systemd.*
        Rename                      _HOSTNAME                       hostname
        Rename                      _SYSTEMD_UNIT                   systemd_unit
        Rename                      MESSAGE                         message
        Remove_regex                ^((?!hostname|systemd_unit|message).)*$

    [FILTER]
        Name                        aws
        Match                       dataplane.*
        imds_version                v2

    [OUTPUT]
        Name                        cloudwatch_logs
        Match                       dataplane.*
        region                      ${AWS_REGION}
        log_group_name              /aws/containerinsights/${CLUSTER_NAME}/dataplane
        log_stream_prefix           ${HOST_NAME}-
        auto_create_group           true
        extra_user_agent            container-insights

  host-log.conf: |
    [INPUT]
        Name                        tail
        Tag                         host.dmesg
        Path                        /var/log/dmesg
        Key                         message
        DB                          /var/fluent-bit/state/flb_dmesg.db
        Mem_Buf_Limit               5MB
        Skip_Long_Lines             On
        Refresh_Interval            10
        Read_from_Head              ${READ_FROM_HEAD}

    [INPUT]
        Name                        tail
        Tag                         host.messages
        Path                        /var/log/messages
        Parser                      syslog
        DB                          /var/fluent-bit/state/flb_messages.db
        Mem_Buf_Limit               5MB
        Skip_Long_Lines             On
        Refresh_Interval            10
        Read_from_Head              ${READ_FROM_HEAD}

    [INPUT]
        Name                        tail
        Tag                         host.secure
        Path                        /var/log/secure
        Parser                      syslog
        DB                          /var/fluent-bit/state/flb_secure.db
        Mem_Buf_Limit               5MB
        Skip_Long_Lines             On
        Refresh_Interval            10
        Read_from_Head              ${READ_FROM_HEAD}

    [FILTER]
        Name                        aws
        Match                       host.*
        imds_version                v2

    [OUTPUT]
        Name                        cloudwatch_logs
        Match                       host.*
        region                      ${AWS_REGION}
        log_group_name              /aws/containerinsights/${CLUSTER_NAME}/host
        log_stream_prefix           ${HOST_NAME}.
        auto_create_group           true
        extra_user_agent            container-insights

  parsers.conf: |
    [PARSER]
        Name                        syslog
        Format                      regex
        Regex                       ^(?&lt;time&gt;[^ ]* {1,2}[^ ]* [^ ]*) (?&lt;host&gt;[^ ]*) (?&lt;ident&gt;[a-zA-Z0-9_\/\.\-]*)(?:\[(?&lt;pid&gt;[0-9]+)\])?(?:[^\:]*\:)? *(?&lt;message&gt;.*)$
        Time_Key                    time
        Time_Format                 %b %d %H:%M:%S

    [PARSER]
        Name                        container_firstline
        Format                      regex
        Regex                       (?&lt;log&gt;(?&lt;="log":")\S(?!\.).*?)(?&lt;!\\)".*(?&lt;stream&gt;(?&lt;="stream":").*?)".*(?&lt;time&gt;\d{4}-\d{1,2}-\d{1,2}T\d{2}:\d{2}:\d{2}\.\w*).*(?=})
        Time_Key                    time
        Time_Format                 %Y-%m-%dT%H:%M:%S.%LZ

    [PARSER]
        Name                        cwagent_firstline
        Format                      regex
        Regex                       (?&lt;log&gt;(?&lt;="log":")\d{4}[\/-]\d{1,2}[\/-]\d{1,2}[ T]\d{2}:\d{2}:\d{2}(?!\.).*?)(?&lt;!\\)".*(?&lt;stream&gt;(?&lt;="stream":").*?)".*(?&lt;time&gt;\d{4}-\d{1,2}-\d{1,2}T\d{2}:\d{2}:\d{2}\.\w*).*(?=})
        Time_Key                    time
        Time_Format                 %Y-%m-%dT%H:%M:%S.%LZ
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluent-bit
  namespace: amazon-cloudwatch
  labels:
    k8s-app: fluent-bit
    version: v1
    kubernetes.io/cluster-service: "true"
spec:
  selector:
    matchLabels:
      k8s-app: fluent-bit
  template:
    metadata:
      labels:
        k8s-app: fluent-bit
        version: v1
        kubernetes.io/cluster-service: "true"
    spec:
      serviceAccountName: fluent-bit # Ensure this matches the ServiceAccount name
      containers:
      - name: fluent-bit
        image: public.ecr.aws/aws-observability/aws-for-fluent-bit:2.32.4
        imagePullPolicy: Always
        env:
            - name: AWS_REGION
              valueFrom:
                configMapKeyRef:
                  name: fluent-bit-cluster-info
                  key: logs.region
            - name: CLUSTER_NAME
              valueFrom:
                configMapKeyRef:
                  name: fluent-bit-cluster-info
                  key: cluster.name
            - name: HTTP_SERVER
              valueFrom:
                configMapKeyRef:
                  name: fluent-bit-cluster-info
                  key: http.server
            - name: HTTP_PORT
              valueFrom:
                configMapKeyRef:
                  name: fluent-bit-cluster-info
                  key: http.port
            - name: READ_FROM_HEAD
              valueFrom:
                configMapKeyRef:
                  name: fluent-bit-cluster-info
                  key: read.head
            - name: READ_FROM_TAIL
              valueFrom:
                configMapKeyRef:
                  name: fluent-bit-cluster-info
                  key: read.tail
            - name: HOST_NAME
              valueFrom:
                fieldRef:
                  fieldPath: spec.nodeName
            - name: HOSTNAME
              valueFrom:
                fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.name
            - name: CI_VERSION
              value: "k8s/1.3.36"
        resources:
            limits:
              memory: 200Mi
            requests:
              cpu: 500m
              memory: 100Mi
        volumeMounts:
        # Please don't change below read-only permissions
        - name: fluentbitstate
          mountPath: /var/fluent-bit/state
        - name: varlog
          mountPath: /var/log
          readOnly: true
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
        - name: fluent-bit-config
          mountPath: /fluent-bit/etc/
        - name: runlogjournal
          mountPath: /run/log/journal
          readOnly: true
        - name: dmesg
          mountPath: /var/log/dmesg
          readOnly: true
      terminationGracePeriodSeconds: 10
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      volumes:
      - name: fluentbitstate
        hostPath:
          path: /var/fluent-bit/state
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
      - name: fluent-bit-config
        configMap:
          name: fluent-bit-config
      - name: runlogjournal
        hostPath:
          path: /run/log/journal
      - name: dmesg
        hostPath:
          path: /var/log/dmesg
      serviceAccountName: fluent-bit
      nodeSelector:
        kubernetes.io/os: linux
</code></pre>
        </section>

        <hr>

        <section class="section">
            <h2>✅ 4. Verify Fluent Bit Setup in CloudWatch</h2>
            <p>Once you've applied the Kubernetes manifests, you can verify that Fluent Bit is successfully sending logs to CloudWatch Logs.</p>

            <h3>Kubernetes Pod Status</h3>
            <p>First, check that your Fluent Bit pods are running in your EKS cluster:</p>
            <pre><code>kubectl get pods -n amazon-cloudwatch
kubectl logs ds/fluent-bit -n amazon-cloudwatch -f
kubectl logs &lt;pod-name&gt; -n amazon-cloudwatch</code></pre>
            <p>Replace <code>&lt;pod-name&gt;</code> with the actual name of one of your Fluent Bit pods.</p>

            <h3>CloudWatch Console Verification</h3>
            <p>
                <a
                href="https://console.aws.amazon.com/cloudwatch/"
                target="_blank"
                rel="noopener"
                class="project-link"
                >View <i class="fas fa-external-link-alt"></i></a
                >
            </p>
            <ol>
                <li>In the navigation pane, choose **Log groups**.</li>
                <li>Make sure that you're in the **Region** where you deployed Fluent Bit.</li>
                <li>Check the list of log groups. You should see entries similar to:
                    <ul>
                        <li><code>/aws/containerinsights/&lt;Cluster_Name&gt;/application</code></li>
                        <li><code>/aws/containerinsights/&lt;Cluster_Name&gt;/host</code></li>
                        <li><code>/aws/containerinsights/&lt;Cluster_Name&gt;/dataplane</code></li>
                    </ul>
                    **Remember to replace <code>&lt;Cluster_Name&gt;</code> with your actual cluster name.**
                </li>
                <li>Navigate to one of these log groups and check the **Last Event Time** for the log streams. If it is recent relative to when you deployed Fluent Bit, the setup is **successfully verified!**</li>
            </ol>
        </section>

    </div>
</body>
</html>

{: .important}
> There might be a slight delay in creating the `<code>/dataplane</code>` log group. This is normal as these log groups only get created when Fluent Bit starts sending logs for that specific log group.
