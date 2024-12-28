---
title: Velaro
layout: default
parent: Kubernetes Projects
nav_order: 1
permalink: /docs/devops/kubernetes/velaro/
---

# 🚀 Kubernetes backup with Velero

## Overview

## Velero, is a powerful yet simple-to-use tool designed specifically for Kubernetes backup and restoration. It enables you to take consistent snapshots of your cluster’s state, including persistent volumes, configuration, and metadata, and store them securely off-cluster.

### 1. Create a identity providers for eks cluster.

- Go to IAM service
- In the left pane, under Access management, select Identity providers.
- Click Add provider.
- Choose OIDC as the provider type.
- In Provider URL paste the OpenID Connect provider URL
- In Audience use "sts.amazonaws.com"

### 2. Create a role and attach policy for velero service account.

#### Create Custom trust policy role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/<OIDC_PROVIDER>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "<OIDC_PROVIDER>:sub": "system:serviceaccount:<namespace>:<serviceaccount-name>",
          "<OIDC_PROVIDER>:aud": "sts.amazonaws.com"
        }
      }
    }
  ]
}
```

#### Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeVolumes",
        "ec2:DescribeSnapshots",
        "ec2:CreateTags",
        "ec2:CreateVolume",
        "ec2:CreateSnapshot",
        "ec2:DeleteSnapshot"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObject",
        "s3:AbortMultipartUpload",
        "s3:ListMultipartUploadParts"
      ],
      "Resource": ["arn:aws:s3:::${BUCKET}/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::${BUCKET}"]
    }
  ]
}
```

### 4. Create an S3 Bucket to store backups

Velero uses S3 to store EKS backups when running in AWS.

#### 5. Add the Velero Helm Repository

```bash
helm repo add vmware-tanzu https://vmware-tanzu.github.io/helm-charts
helm repo update
```

#### 6. Create a service account for accessing the aws velero role.

```bash
kubectl create serviceaccount velero -n velero
kubectl annotate serviceaccount velero -n velero \
    eks.amazonaws.com/role-arn=<role-arn>

```

#### 7. Install velero cli in your system

- Go to https://github.com/vmware-tanzu/velero/releases/tag/v1.15.0
- Download the velero version
- Extract the file and move the binary to /usr/local/bin/
- Verify installation use cmd "velero version"

#### 8. Create a custom values file

####

```yaml
configuration:
  backupStorageLocation:
  - bucket: velero-testing-123
    provider: aws
  volumeSnapshotLocation:
  - config:
      region: <region>
    provider: aws
initContainers:
- name: velero-plugin-for-aws
  image: velero/velero-plugin-for-aws:v1.10.0
  volumeMounts:
  - mountPath: /target
    name: plugins
credentials:
  useSecret: false
serviceAccount:
  server:
    annotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam::547580490325:role/Velero-testing"
```

{: .note}
> If we want to use already created service account then use below value file

```yaml
configuration:
  backupStorageLocation:
  - bucket: velero-testing-123
    provider: aws
  volumeSnapshotLocation:
  - config:
      region: ap-east-1
    provider: aws
initContainers:
- name: velero-plugin-for-aws
  image: velero/velero-plugin-for-aws:v1.10.0
  volumeMounts:
  - mountPath: /target
    name: plugins
credentials:
  useSecret: false
serviceAccount:
  server:
    create: false
    name: <serviceaccount name>
```

```bash
helm install velero vmware-tanzu/velero --values velero-values.yaml --namespace velero

velero backup-location get
```

---

#### 9. verify the backup location

- The phase in output should be available for below command

```bash
velero backup-location get
```

#### 10. Creating a backup

- We can use below cli command to create a backup

```bash
velero create backup my-first-backup-demo
```

- We can create a manifest file for backup

```yaml
apiVersion: velero.io/v1
kind: Backup
metadata:
  name: my-first-backup-demo
  namespace: velero
spec:
  includedNamespaces:
    - velero-backup
  excludedNamespaces:
    - kube-system
  includedResources:
    - "*"
  excludedResources:
    - events
  labelSelector:
    matchLabels:
      app: my-app
  storageLocation: default
  snapshotVolumes: true
  ttl: 0h60m0s
```

- Verify the backup status using the below commands:

```bash
velero backup describe my-first-backup-demo
```

#### 10. Restoration Process

- We can restore using below command:

```bash
velero restore create --from-backup my-first-backup-demo

velero restore describe my-first-backup-demo-20240413163430

velero restore logs my-first-backup-demo-20240413163430
```

#### 11. Schedule Backups

- We can use below cli command to set the schedule backups for kubernetes cluster:

```bash
velero schedule create my-first-schedule --schedule="*/1 * * * *"
```

- We can create a manifest file for schedule backups

```yaml
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: daily-backup
  namespace: velero
spec:
  schedule: "*/5 * * * *" # Cron expression for every 5 mins
  template:
    includedNamespaces:
      - velero-backup
    excludedNamespaces:
      - kube-system
    includedResources:
      - "*"
    excludedResources:
      - events
    labelSelector:
      matchLabels:
        app: my-app
    storageLocation: default
    snapshotVolumes: true
    ttl: 0h5m0s # Backup retention time (7 days)
```

## Reference

[medium](https://medium.com/@muppedaanvesh/%EF%B8%8F-mastering-kubernetes-backups-with-velero-60cf05e6d9a1)

[aws](https://aws.amazon.com/blogs/containers/backup-and-restore-your-amazon-eks-cluster-resources-using-velero/)
