---
title: AWS CloudWatch Logging with Fluent Bit on Kubernetes
layout: doc-page
parent: Kubernetes Projects
nav_order: 15
permalink: /docs/devops/kubernetes/eks-logs-into-cloudwatch-using-fluentbit/
description: Documentation on AWS CloudWatch Logging with Fluent Bit on Kubernetes.
---

# 📊 AWS CloudWatch Logging with Fluent Bit on Kubernetes

This guide walks you through setting up \*\*Fluent Bit\*\* as a DaemonSet in your \*\*Amazon EKS cluster\*\* to send container, host, and dataplane logs to \*\*AWS CloudWatch Logs\*\*. This ensures robust observability for your Kubernetes workloads.

---

## ✨ 1. Create Namespace: `amazon-cloudwatch`

First, we need to create a dedicated Kubernetes namespace for our CloudWatch logging components.

```
# create amazon-cloudwatch namespace
apiVersion: v1
kind: Namespace
metadata:
  name: amazon-cloudwatch
  labels:
    name: amazon-cloudwatch
```

Apply this YAML using `kubectl apply -f <filename>` or directly with `kubectl create namespace amazon-cloudwatch`.

---

## 📝 2. Create ConfigMap: `fluent-bit-cluster-info`

Next, we'll create a ConfigMap to store essential cluster-specific information that Fluent Bit will use.

```
ClusterName=MillenniumFalcon
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
--from-literal=logs.region=${RegionName} -n amazon-cloudwatch
```

\*\*Remember to replace `MillenniumFalcon` with your actual EKS cluster name and `ap-southeast-1` with your AWS Region.\*\*

---

## 📦 3. Deploy Fluent Bit as a DaemonSet to Send Logs

To enable Fluent Bit to collect and send logs to CloudWatch, we need to set up appropriate IAM permissions and Kubernetes resources.

### 🔑 IAM Role for Service Account (IRSA) Policy

Create an IAM policy that allows Fluent Bit to write to CloudWatch Logs. This policy will be associated with a Kubernetes Service Account via \*\*IAM Roles for Service Accounts (IRSA)\*\*.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/oidc.eks.ap-southeast-1.amazonaws.com/id/<OIDC_ID>"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "oidc.eks.ap-southeast-1.amazonaws.com/id/<OIDC_ID>:sub": "system:serviceaccount:amazon-cloudwatch:fluent-bit",
                    "oidc.eks.ap-southeast-1.amazonaws.com/id/<OIDC_ID>:aud": "sts.amazonaws.com"
                }
            }
        }
    ]
}
```

\*\*Important:\*\*

* Replace `<ACCOUNT_ID>` with your AWS account ID.
* Replace `<OIDC_ID>` with your EKS cluster's OIDC provider ID. You can find this by running `aws eks describe-cluster --name your-cluster-name --query "cluster.identity.oidc.issuer" --output text` and extracting the ID from the URL.

Attach the necessary CloudWatch Logs write permissions to this IAM Role. For example, `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`, `logs:DescribeLogGroups`, `logs:DescribeLogStreams`.

### ☸️ Kubernetes Manifests (ServiceAccount, ClusterRole, ConfigMap, DaemonSet)

Apply the following comprehensive YAML to create the Service Account, ClusterRole, ClusterRoleBinding, a detailed Fluent Bit configuration ConfigMap, and the Fluent Bit DaemonSet itself.

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: fluent-bit
  namespace: amazon-cloudwatch
  annotations: 
    eks.amazonaws.com/role-arn: "arn:aws:iam::<ACCOUNT_ID>:role/LokiServiceAccountRole" # Replace <ACCOUNT_ID> with your AWS Account ID
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
        Regex                       ^(?<time>[^ ]* {1,2}[^ ]* [^ ]*) (?<host>[^ ]*) (?<ident>[a-zA-Z0-9_\/\.\-]*)(?:\[(?<pid>[0-9]+)\])?(?:[^\:]*\:)? *(?<message>.*)$
        Time_Key                    time
        Time_Format                 %b %d %H:%M:%S

    [PARSER]
        Name                        container_firstline
        Format                      regex
        Regex                       (?<log>(?<="log":")\S(?!\.).*?)(?<!\\)".*(?<stream>(?<="stream":").*?)".*(?<time>\d{4}-\d{1,2}-\d{1,2}T\d{2}:\d{2}:\d{2}\.\w*).*(?=})
        Time_Key                    time
        Time_Format                 %Y-%m-%dT%H:%M:%S.%LZ

    [PARSER]
        Name                        cwagent_firstline
        Format                      regex
        Regex                       (?<log>(?<="log":")\d{4}[\/-]\d{1,2}[\/-]\d{1,2}[ T]\d{2}:\d{2}:\d{2}(?!\.).*?)(?<!\\)".*(?<stream>(?<="stream":").*?)".*(?<time>\d{4}-\d{1,2}-\d{1,2}T\d{2}:\d{2}:\d{2}\.\w*).*(?=})
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
```

---

## ✅ 4. Verify Fluent Bit Setup in CloudWatch

Once you've applied the Kubernetes manifests, you can verify that Fluent Bit is successfully sending logs to CloudWatch Logs.

### Kubernetes Pod Status

First, check that your Fluent Bit pods are running in your EKS cluster:

```
kubectl get pods -n amazon-cloudwatch
kubectl logs ds/fluent-bit -n amazon-cloudwatch -f
kubectl logs <pod-name> -n amazon-cloudwatch
```

Replace `<pod-name>` with the actual name of one of your Fluent Bit pods.

### CloudWatch Console Verification

[View](https://console.aws.amazon.com/cloudwatch/)

1. In the navigation pane, choose \*\*Log groups\*\*.
2. Make sure that you're in the \*\*Region\*\* where you deployed Fluent Bit.
3. Check the list of log groups. You should see entries similar to:
   * `/aws/containerinsights/<Cluster_Name>/application`
   * `/aws/containerinsights/<Cluster_Name>/host`
   * `/aws/containerinsights/<Cluster_Name>/dataplane`\*\*Remember to replace `<Cluster_Name>` with your actual cluster name.\*\*
4. Navigate to one of these log groups and check the \*\*Last Event Time\*\* for the log streams. If it is recent relative to when you deployed Fluent Bit, the setup is \*\*successfully verified!\*\*
