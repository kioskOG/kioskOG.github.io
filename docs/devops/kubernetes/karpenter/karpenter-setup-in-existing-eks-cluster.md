---
title: Setup Karpenter on Existing EKS Cluster
layout: home
parent: Karpenter
grand_parent: Kubernetes Projects
nav_order: 1
permalink: /docs/devops/kubernetes/karpenter/karpenter-setup-in-existing-eks-cluster/
description: Documentation on karpenter serving
---

# EKS scaling with Karpenter

![karpenter](/docs/devops/kubernetes/karpenter/images/karpenter-main.png)

# Table of Contents

1. [📋 Setting up Karpenter on Existing EKS Cluster 🪵🪚](#setting-up-karpenter-on-existing-eks-cluster-)
2. [🎯 Prerequisites](#prerequisites)
3. [🎯 Prepration](#prepration)
   - [Export all of this Environment](#1-export-all-of-this-environment)
   - [We will create two IAM roles](#2-we-will-create-two-iam-roles)
   - [Tag Subnets](#3-tag-subnets)
   - [Tag Security Groups](#4-tag-security-groups)
   - [Update aws-auth on your cluster with this script](#5-update-aws-auth-on-your-cluster-with-this-script)
4. [Installation](#installation)
   - [1. Export this variable](#1-export-this-variable)
   - [2. Generate karpenter.yaml](#2-generate-karpenteryaml)
   - [karpenter Config](#3-karpenter-config)
   - [Deploy karpenter](#4-deploy-karpenter)
   - [Create NodePool & EC2NodeClass](#5-create-nodepool--ec2nodeclass)
5. [Cluster Auto Scaler](#cluster-auto-scaler)
6. [Check karpenter logs](#check-karpenter-logs)
7. [Troubleshot](#troubleshot)

## Setting up Karpenter on Existing EKS Cluster 🪵🪚

## Prerequisites

1. AWS CLI configured with appropriate credentials

2. kubectl installed

3. An existing EKS cluster

4. Helm


## Prepration

### 1. Export all of this Environment

```bash
KARPENTER_NAMESPACE=karpenter
CLUSTER_NAME=<your-cluster-name>
AWS_PARTITION="aws"
AWS_REGION="$(aws configure list | grep region | tr -s " " | cut -d" " -f3)"
OIDC_ENDPOINT="$(aws eks describe-cluster --name "${CLUSTER_NAME}" \
    --query "cluster.identity.oidc.issuer" --output text)"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' \
    --output text)
K8S_VERSION=1.28
ARM_AMI_ID="$(aws ssm get-parameter --name /aws/service/eks/optimized-ami/${K8S_VERSION}/amazon-linux-2-arm64/recommended/image_id --query Parameter.Value --output text)"
AMD_AMI_ID="$(aws ssm get-parameter --name /aws/service/eks/optimized-ami/${K8S_VERSION}/amazon-linux-2/recommended/image_id --query Parameter.Value --output text)"
GPU_AMI_ID="$(aws ssm get-parameter --name /aws/service/eks/optimized-ami/${K8S_VERSION}/amazon-linux-2-gpu/recommended/image_id --query Parameter.Value --output text)"
```

### 2. We will create two IAM roles:

- KarpenterNodeRole-{your-cluster-name} (For the nodes which are going to be created by karpeneter)
- KarpenterControllerRole-{your-cluster-name} (For creating the nodes in the cluster)


### **KarpenterNodeRole-{your-cluster-name}**

```bash
echo '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "ec2.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}' > node-trust-policy.json

aws iam create-role --role-name "KarpenterNodeRole-${CLUSTER_NAME}" \
    --assume-role-policy-document file://node-trust-policy.json
```

```bash
aws iam attach-role-policy --role-name "KarpenterNodeRole-${CLUSTER_NAME}" \
    --policy-arn "arn:${AWS_PARTITION}:iam::aws:policy/AmazonEKSWorkerNodePolicy"

aws iam attach-role-policy --role-name "KarpenterNodeRole-${CLUSTER_NAME}" \
    --policy-arn "arn:${AWS_PARTITION}:iam::aws:policy/AmazonEKS_CNI_Policy"

aws iam attach-role-policy --role-name "KarpenterNodeRole-${CLUSTER_NAME}" \
    --policy-arn "arn:${AWS_PARTITION}:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"

aws iam attach-role-policy --role-name "KarpenterNodeRole-${CLUSTER_NAME}" \
    --policy-arn "arn:${AWS_PARTITION}:iam::aws:policy/AmazonSSMManagedInstanceCore"
```


**KarpenterControllerRole-{your-cluster-name}**

```bash
cat << EOF > controller-trust-policy.json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:${AWS_PARTITION}:iam::${AWS_ACCOUNT_ID}:oidc-provider/${OIDC_ENDPOINT#*//}"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "${OIDC_ENDPOINT#*//}:aud": "sts.amazonaws.com",
                    "${OIDC_ENDPOINT#*//}:sub": "system:serviceaccount:${KARPENTER_NAMESPACE}:karpenter"
                }
            }
        }
    ]
}
EOF

aws iam create-role --role-name "KarpenterControllerRole-${CLUSTER_NAME}" \
    --assume-role-policy-document file://controller-trust-policy.json

cat << EOF > controller-policy.json
{
    "Statement": [
        {
            "Action": [
                "ssm:GetParameter",
                "ec2:DescribeImages",
                "ec2:RunInstances",
                "ec2:DescribeSubnets",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeLaunchTemplates",
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceTypes",
                "ec2:DescribeInstanceTypeOfferings",
                "ec2:DescribeAvailabilityZones",
                "ec2:DeleteLaunchTemplate",
                "ec2:CreateTags",
                "ec2:CreateLaunchTemplate",
                "ec2:CreateFleet",
                "ec2:DescribeSpotPriceHistory",
                "pricing:GetProducts"
            ],
            "Effect": "Allow",
            "Resource": "*",
            "Sid": "Karpenter"
        },
        {
            "Action": "ec2:TerminateInstances",
            "Condition": {
                "StringLike": {
                    "ec2:ResourceTag/karpenter.sh/nodepool": "*"
                }
            },
            "Effect": "Allow",
            "Resource": "*",
            "Sid": "ConditionalEC2Termination"
        },
        {
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "arn:${AWS_PARTITION}:iam::${AWS_ACCOUNT_ID}:role/KarpenterNodeRole-${CLUSTER_NAME}",
            "Sid": "PassNodeIAMRole"
        },
        {
            "Effect": "Allow",
            "Action": "eks:DescribeCluster",
            "Resource": "arn:${AWS_PARTITION}:eks:${AWS_REGION}:${AWS_ACCOUNT_ID}:cluster/${CLUSTER_NAME}",
            "Sid": "EKSClusterEndpointLookup"
        },
        {
            "Sid": "AllowScopedInstanceProfileCreationActions",
            "Effect": "Allow",
            "Resource": "*",
            "Action": [
            "iam:CreateInstanceProfile"
            ],
            "Condition": {
            "StringEquals": {
                "aws:RequestTag/kubernetes.io/cluster/${CLUSTER_NAME}": "owned",
                "aws:RequestTag/topology.kubernetes.io/region": "${AWS_REGION}"
            },
            "StringLike": {
                "aws:RequestTag/karpenter.k8s.aws/ec2nodeclass": "*"
            }
            }
        },
        {
            "Sid": "AllowScopedInstanceProfileTagActions",
            "Effect": "Allow",
            "Resource": "*",
            "Action": [
            "iam:TagInstanceProfile"
            ],
            "Condition": {
            "StringEquals": {
                "aws:ResourceTag/kubernetes.io/cluster/${CLUSTER_NAME}": "owned",
                "aws:ResourceTag/topology.kubernetes.io/region": "${AWS_REGION}",
                "aws:RequestTag/kubernetes.io/cluster/${CLUSTER_NAME}": "owned",
                "aws:RequestTag/topology.kubernetes.io/region": "${AWS_REGION}"
            },
            "StringLike": {
                "aws:ResourceTag/karpenter.k8s.aws/ec2nodeclass": "*",
                "aws:RequestTag/karpenter.k8s.aws/ec2nodeclass": "*"
            }
            }
        },
        {
            "Sid": "AllowScopedInstanceProfileActions",
            "Effect": "Allow",
            "Resource": "*",
            "Action": [
            "iam:AddRoleToInstanceProfile",
            "iam:RemoveRoleFromInstanceProfile",
            "iam:DeleteInstanceProfile"
            ],
            "Condition": {
            "StringEquals": {
                "aws:ResourceTag/kubernetes.io/cluster/${CLUSTER_NAME}": "owned",
                "aws:ResourceTag/topology.kubernetes.io/region": "${AWS_REGION}"
            },
            "StringLike": {
                "aws:ResourceTag/karpenter.k8s.aws/ec2nodeclass": "*"
            }
            }
        },
        {
            "Sid": "AllowInstanceProfileReadActions",
            "Effect": "Allow",
            "Resource": "*",
            "Action": "iam:GetInstanceProfile"
        }
    ],
    "Version": "2012-10-17"
}
EOF

aws iam put-role-policy --role-name "KarpenterControllerRole-${CLUSTER_NAME}" \
    --policy-name "KarpenterControllerPolicy-${CLUSTER_NAME}" \
    --policy-document file://controller-policy.json
```


![IAM-Roles](/docs/devops/kubernetes/karpenter/images/Iam-roles.png)

## 3. Tag Subnets
Create new tags for Subnet based on NodeGroup that used on your existing Cluster using this script:

```bash
for NODEGROUP in $(aws eks list-nodegroups --cluster-name "${CLUSTER_NAME}" --query 'nodegroups' --output text); do
    aws ec2 create-tags \
        --tags "Key=karpenter.sh/discovery,Value=${CLUSTER_NAME}" \
        --resources $(aws eks describe-nodegroup --cluster-name "${CLUSTER_NAME}" \
        --nodegroup-name "${NODEGROUP}" --query 'nodegroup.subnets' --output text )
done
```

{: .note}
> This script will do a loop:
>
> a. Get NodeGroup name
>
> b. Get the subnet from that NodeGroup
>
> c. Create tags karpenter.sh/discovery=<your-cluster-name> to the subnet
>
> It will repeat to all of the NodeGroup within your EKS cluster.


## 4. Tag Security Groups

Create new tags for Security Group that used on your existing cluster using this script:

> Create tags `karpenter.sh/discovery=<your-cluster-name>` to the Security Group

```bash
SECURITY_GROUPS=$(aws eks describe-cluster \
    --name "${CLUSTER_NAME}" --query "cluster.resourcesVpcConfig.clusterSecurityGroupId" --output text)

aws ec2 create-tags \
    --tags "Key=karpenter.sh/discovery,Value=${CLUSTER_NAME}" \
    --resources "${SECURITY_GROUPS}"
```

## 5. Update aws-auth on your cluster with this script

```bash
kubectl edit configmap aws-auth -n kube-system
```

Add this section & update <your_aws_account_id> , let the `{{EC2PrivateDNSName}}` like that

```bash
- groups:
  - system:bootstrappers
  - system:nodes
  rolearn: arn:aws:iam::<your_aws_account_id>:role/KarpenterNodeRole-eksdemo1
  username: system:node:{{EC2PrivateDNSName}}
```

🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵

## Installation

### 1. Export this variable

```bash
export KARPENTER_VERSION="1.3.3"
```

### 2. Generate karpenter.yaml
Run this helm script to generate karpenter.yaml file

```bash
helm template karpenter oci://public.ecr.aws/karpenter/karpenter --version "${KARPENTER_VERSION}" --namespace "${KARPENTER_NAMESPACE}" \
    --set "settings.clusterName=${CLUSTER_NAME}" \
    --set "serviceAccount.annotations.eks\.amazonaws\.com/role-arn=arn:${AWS_PARTITION}:iam::${AWS_ACCOUNT_ID}:role/KarpenterControllerRole-${CLUSTER_NAME}" \
    --set controller.resources.requests.cpu=1 \
    --set controller.resources.requests.memory=1Gi \
    --set controller.resources.limits.cpu=1 \
    --set controller.resources.limits.memory=1Gi > karpenter.yaml
```

{: .note}
> You can change the Request and Limits for the CPU and Memory, but the minimum is 1. Both for CPU and Memory. This CPU and Memory resources will run for the Karpenter pods.


Pay attention to this section
```bash
- set "serviceAccount.annotations.eks\.amazonaws\.com/role-arn=arn:${AWS_PARTITION}:iam::${AWS_ACCOUNT_ID}:role/KarpenterControllerRole-${CLUSTER_NAME}"
```

Make sure on the end you type `KarpenterControllerRole` not the `NodeRole`.


{: .important}
> when executing this `helm template` command if you get 🚨 Helm OCI Registry Authentication Issue as mentioned below, 

```bash
error getting credentials - err: exec: "docker-credential-desktop": executable file not found in $PATH
```

#### Solution:-

```bash
aws ecr-public get-login-password --region us-east-1 | helm registry login --username AWS --password-stdin public.ecr.aws
```

This authenticates Helm to pull images from AWS Public ECR.


### 3. karpenter Config
Now we have the `karpenter.yaml` file

Inside the `karpenter.yaml` file, there a section that need to be edited. Look for NodeAffinity and add this part to the yaml.

```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: karpenter.sh/nodepool
          operator: DoesNotExist
        - key: eks.amazonaws.com/nodegroup
          operator: In
          values:
          - <your-node-group-name>
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - topologyKey: "kubernetes.io/hostname"
```

Fill the `your-node-group-name` with the NodeGroup name that you want karpenter run on.

For example, i have 1 `NodeGroup` named `frontend`.

> * I want Karpenter run on the frontend, so i fill that value with frontend.

> * If you want the karpenter run on two of the NodeGroup, just add another NodeGroup name below the first one, like this:

```yaml
- key: eks.amazonaws.com/nodegroup
  operator: In
  values:
  - frontend
  - <second-node-group>
```

{: .note}
> You can use this command t see the labels mentioned above
>
```bash
kubectl get no --show-labels
```
>

### 4. Deploy karpenter

After the `karpenter.yaml` ready, you just need to apply it. Use this script to create a namespace for the karpenter, install another karpenter dependencies, and also install the karpenter.yaml:

```bash
kubectl create namespace "${KARPENTER_NAMESPACE}" || true
kubectl create -f \
    "https://raw.githubusercontent.com/aws/karpenter-provider-aws/v${KARPENTER_VERSION}/pkg/apis/crds/karpenter.sh_nodepools.yaml"
kubectl create -f \
    "https://raw.githubusercontent.com/aws/karpenter-provider-aws/v${KARPENTER_VERSION}/pkg/apis/crds/karpenter.k8s.aws_ec2nodeclasses.yaml"
kubectl create -f \
    "https://raw.githubusercontent.com/aws/karpenter-provider-aws/v${KARPENTER_VERSION}/pkg/apis/crds/karpenter.sh_nodeclaims.yaml"
kubectl apply -f karpenter.yaml
```

### 5. Create NodePool & EC2NodeClass

Karpenter uses two primary custom resources to control its behavior:

- **NodePool**: Defines what kind of nodes Karpenter will create

- **EC2NodeClass**: Specifies AWS-specific configuration for the nodes

> Understanding NodePool and EC2NodeClass

The `NodePool` resource defines instance `types, CPU architecture, capacity types, availability zones, and more`.

The `EC2NodeClass` defines AWS-specific configuration like `AMI family, subnet selection, and security groups`.


After the karpenter apply finish without any error, create NodePool with this script:

```bash
cat <<EOF | envsubst | kubectl apply -f -
# NodePool example
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: default-x86
spec:
  template:
    spec:
      nodeClassRef:
        kind: EC2NodeClass
        name: default
        group: karpenter.k8s.aws
      requirements:
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]
        - key: kubernetes.io/os
          operator: In
          values: ["linux"]
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["on-demand", "spot"]
        - key: node.kubernetes.io/instance-type
          operator: In
          values: ["t2.micro", "t2.small", "t2.medium", "t2.large"]
  limits:
    cpu: "1000"
    memory: "1000Gi"
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 30s
---
# EC2NodeClass example
apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
  name: default
spec:
  amiFamily: AL2
  subnetSelectorTerms:
    - tags:
        karpenter.sh/discovery: eksdemo1
  securityGroupSelectorTerms:
    - tags:
        karpenter.sh/discovery: eksdemo1
  amiSelectorTerms:
    - id: "ami-0a991ffa1379f681b"
    - id: "ami-03fcb7c9c1ca36b4d"
  role: arn:aws:iam::271268512135:role/KarpenterNodeRole-eksdemo1
  blockDeviceMappings:
    - deviceName: /dev/xvda
      ebs:
        volumeSize: 10Gi
        volumeType: gp3
        deleteOnTermination: true
        encrypted: true
EOF
```

This script will create:

* NodePool

* EC2NodeClass

Now you have karpenter running on your existing cluster

{: .important}
> Karpenter Node will not joining your NodeGroup. It will be like a standalone Node within your cluster.

## Cluster Auto Scaler
Remove Cluster Auto Scaler (if available) using this script:
```bash
kubectl scale deploy/cluster-autoscaler -n kube-system --replicas=0
```

## Check karpenter logs

```bash
kubectl logs -f -n karpenter -c controller -l app.kubernetes.io/name=karpenter
```

## Troubleshot

>> `EC2NodeClass` status is crucial!

Based on what we implement using above tutorial, we apply Kind:EC2NodeClass on the kubernetes Cluster. This EC2NodeClass will look for a tags we have created before on our Security Group and Subnet.

If you created tags on the wrong Security Group or Subnet, EC2NodeClass status will be change to Failed to resolve security groups . Just make sure to create the Tags on the correct resource. Use kubectl describe ec2nodeclass default to check for the status. Below is the example of correct status:

<!-- https://medium.com/@fiardikarizki/karpenter-on-existing-eks-749e14a70b0d -->
