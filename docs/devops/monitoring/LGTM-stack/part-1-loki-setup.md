---
title: Grafana Loki Setup
layout: home
parent: Taming the Digital Wilds with Grafana's LGTM Stack
grand_parent: monitoring
nav_order: 2
permalink: /docs/devops/monitoring/LGTM-stack/part-1-loki-setup/
description: Grafana Loki Setup.
---


# LGTM-stack


## Deploy the Loki Helm chart on AWS
I expect you to have the necessary tools and permissions to deploy resources on AWS, such as:

- Full access to EKS (Amazon Elastic Kubernetes Service)
- Full access to S3 (Amazon Simple Storage Service)
- Sufficient permissions to create IAM (Identity Access Management) roles and policies

## Pre-requisits:-
- Helm 3 or above. [This should be installed on your local machine.](https://helm.sh/docs/intro/install/)
- A running Kubernetes cluster on AWS with OIDC configure
- Create an IAM role Mentioned Below for Mimir & Tempo & should have access to s3.
- Create a Storage-class named `gp2-standard`


## The minimum requirements for deploying Loki on EKS are:

- Kubernetes version 1.30 or above.
- 3 nodes for the EKS cluster.
- Instance type depends on your workload. A good starting point for a production cluster is `m7i.2xlarge`.

## The following plugins must also be installed within the EKS cluster:

- **Amazon EBS CSI Driver:** Enables Kubernetes to dynamically provision and manage EBS volumes as persistent storage for applications. We use this to provision the node volumes for Loki.

- **CoreDNS:** Provides internal DNS service for Kubernetes clusters, ensuring that services and pods can communicate with each other using DNS names.

- **kube-proxy:** Maintains network rules on nodes, enabling communication between pods and services within the cluster.

### 1. Create S3 buckets & Storage-class
```bash
aws s3 mb s3://bellatrix-loki-chunk --region eu-central-1 && aws s3 mb s3://bellatrix-loki-ruler --region eu-central-1
```

>> storage-class

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp2-standard
  annotations: 
    storageclass.kubernetes.io/is-default-class: "true" 
provisioner: ebs.csi.aws.com   # Internal-provisioner
allowVolumeExpansion: true
parameters:
  type: gp2
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
```

### 2. Defining IAM roles and policies

> [!NOTE]
> Create a new directory and navigate to it. Make sure to create the files in this directory

Create a `loki-s3-policy.json` file with the following content:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "LokiStorage",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::bellatrix-loki-chunk",
                "arn:aws:s3:::bellatrix-loki-chunk/*",
                "arn:aws:s3:::bellatrix-loki-ruler",
                "arn:aws:s3:::bellatrix-loki-ruler/*"
            ]
        }
    ]
}
```

### 3. Create the IAM policy using the AWS CLI:

```bash
aws iam create-policy --policy-name LokiS3AccessPolicy --policy-document file://loki-s3-policy.json
```

### 4. Create a trust policy document named `trust-policy.json` with the following content:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::<Account ID>:oidc-provider/oidc.eks.ap-southeast-1.amazonaws.com/id/905FD3625D5E720BDB50A6227B6B654A"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "oidc.eks.ap-southeast-1.amazonaws.com/id/905FD3625D5E720BDB50A6227B6B654A:sub": "system:serviceaccount:loki:loki",
                    "oidc.eks.ap-southeast-1.amazonaws.com/id/905FD3625D5E720BDB50A6227B6B654A:aud": "sts.amazonaws.com"
                }
            }
        }
    ]
}
```


{: .important}
> Update the above policy as required, like update the `OIDC Arn` .

### 5. Create the IAM role using the AWS CLI:

```bash
aws iam create-role --role-name LokiServiceAccountRole --assume-role-policy-document file://trust-policy.json
```

### 6. Attach the policy to the role:

```bash
aws iam attach-role-policy --role-name LokiServiceAccountRole --policy-arn arn:aws:iam::<Account ID>:policy/LokiS3AccessPolicy
```

### 7. Deploying the Helm chart
>> Add the Grafana chart repository to Helm:

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
kubectl create namespace loki
```

### 8. Loki Basic Authentication

Loki by default does not come with any authentication. Since we will be deploying Loki to AWS and exposing the gateway to the internet near future, as of now we aren't exposing it to internet, I recommend adding at least basic authentication. In this guide we will give Loki a `username` and `password`:

1. To start we will need create a `.htpasswd` file with the `username` and `password`. You can use the `htpasswd` command to create the file:

```bash
htpasswd -c .htpasswd <username>
```

> [!NOTE]
> This will create a file called `auth` with the username you enterned. You will be prompted to enter a password.

2. Create a Kubernetes secret with the .htpasswd file:
```bash
kubectl create secret generic loki-basic-auth --from-file=.htpasswd -n loki
```

This will create a secret called loki-basic-auth in the loki namespace. We will reference this secret in the Loki Helm chart configuration.

3. Create a `canary-basic-auth` secret for the canary:

```bash
kubectl create secret generic canary-basic-auth \
  --from-literal=username=<USERNAME> \
  --from-literal=password=<PASSWORD> \
  -n loki
```
I have used username & password as `loki-canary`.

you can find the loki helm chart values under loki directory.

## 9. Deploy loki

> [!IMPORTANT]
>
> helm upgrade --install loki grafana/loki -n loki --create-namespace --values "<path-of-loki-override-values.yaml>"

4. Verify the deployment:

```bash
kubectl get pods -n loki
```

## 10. Find the Loki Gateway Service

```bash
kubectl get svc -n loki
```

> [!IMPORTANT]
> Congratulations! You have successfully deployed Loki on AWS using the Helm chart. Before we finish, let’s test the deployment.

## 11. Testing Your Loki Deployment
k6 is one of the fastest ways to test your Loki deployment. This will allow you to both write and query logs to Loki. To get started with k6, follow the steps below:

1. Install k6 with the Loki extension on your local machine. Refer to [Installing k6 and the xk6-loki extension](https://grafana.com/docs/loki/latest/send-data/k6/)

2. Create a `aws-test.js` file with the following content:

```javascript
 import {sleep, check} from 'k6';
 import loki from 'k6/x/loki';

 /**
 * URL used for push and query requests
 * Path is automatically appended by the client
 * @constant {string}
 */

 const username = '<USERNAME>';
 const password = '<PASSWORD>';
 const external_ip = '<EXTERNAL-IP>';

 const credentials = `${username}:${password}`;

 const BASE_URL = `http://${credentials}@${external_ip}`;

 /**
 * Helper constant for byte values
 * @constant {number}
 */
 const KB = 1024;

 /**
 * Helper constant for byte values
 * @constant {number}
 */
 const MB = KB * KB;

 /**
 * Instantiate config and Loki client
 */

 const conf = new loki.Config(BASE_URL);
 const client = new loki.Client(conf);

 /**
 * Define test scenario
 */
 export const options = {
   vus: 10,
   iterations: 10,
 };

 export default () => {
   // Push request with 10 streams and uncompressed logs between 800KB and 2MB
   var res = client.pushParameterized(10, 800 * KB, 2 * MB);
   // Check for successful write
   check(res, { 'successful write': (res) => res.status == 204 });

   // Pick a random log format from label pool
   let format = randomChoice(conf.labels["format"]);

   // Execute instant query with limit 1
   res = client.instantQuery(`count_over_time({format="${format}"}[1m])`, 1)
   // Check for successful read
   check(res, { 'successful instant query': (res) => res.status == 200 });

   // Execute range query over last 5m and limit 1000
   res = client.rangeQuery(`{format="${format}"}`, "5m", 1000)
   // Check for successful read
   check(res, { 'successful range query': (res) => res.status == 200 });

   // Wait before next iteration
   sleep(1);
 }

 /**
 * Helper function to get random item from array
 */
 function randomChoice(items) {
   return items[Math.floor(Math.random() * items.length)];
 }
 ```

 > [!TIP]
 > use kubectl-port to forward loki-gateway service on your local.

 >> Replace <EXTERNAL-IP> with the localhost IP address with port of the Loki Gateway service.

 >> Replace <USERNAME> & <PASSWORD> with canary-basic-auth which we created.

> [!NOTE]
> This script will write logs to Loki and query logs from Loki. It will write logs in a random format between 800KB and 2MB and query logs in a random format over the last 5 minutes.


3. Run the test:
```bash
./k6 run aws-test.js
```
