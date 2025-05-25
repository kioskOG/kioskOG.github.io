---
title: Accessing AWS Services from GKE using GCP Workload Identity and AWS OIDC
layout: home
parent: Google Cloud Platform
grand_parent: Cloud Projects
nav_order: 5
author: Jatin Sharma
permalink: /docs/devops/Cloud/Gcp/Accessing-AWS-Services-from-GKE-using-Workload-Identity-and-Aws-oidc/
description: Documentation for Accessing AWS Services from GKE using GCP Workload Identity and AWS OIDC.
---


# ☁️ Accessing AWS Services from GKE using Workload Identity and AWS OIDC

> "We had a need to securely connect our GKE workloads to AWS Services without hardcoding credentials. This guide is a result of solving that challenge end-to-end."

---

## 🧩 The Real-World Problem

In our hybrid cloud architecture, some services run on **Google Kubernetes Engine (GKE)**, but object storage like logs, exports, and backups reside in **AWS**. The challenge was: **How do we securely allow GKE pods to access AWS services like S3 without embedding AWS credentials?**

Our goals:

* Avoid long-lived AWS access keys
* Use short-lived credentials tied to pod identity
* Maintain least-privilege access

That's where **Workload Identity Federation** and **AWS Web Identity Token-based roles** came into play.

---

## ✅ Goal:

Allow a GKE workload (Pod) to authenticate to AWS IAM without hardcoded credentials, using OIDC federation & access AWS Services.

## 🔧 Prerequisites

### Step 1: Prerequisites

* A running GKE cluster with **Workload Identity** enabled.
* An AWS account with IAM access.
* A GCP service account mapped to your pod’s Kubernetes service account.

---

## 🛠️ Implementation Steps

### Step 2: Create Kubernetes Service Account (KSA)

* Create a Kubernetes service account (e.g., gke-service-account) in your GKE cluster.

### Step 3: Create GCP Service Account (GSA)

* Create a GCP service account (e.g., gke-to-aws-test) and allow it to impersonate roles if needed.

### Step 4: Bind GSA to KSA via Workload Identity

* Annotate the KSA with the GSA email.

> > > This allows the pod running with KSA to assume the identity of GSA.

### Step 5: Create IAM Role in AWS

* Create an AWS IAM role with s3:\* permissions.
* Trust policy must allow web identity federation from Google’s OIDC provider.

### Step 6: Configure Trust Relationship in AWS

* Use GCP’s workload identity OIDC URL **(container.googleapis.com/v1/projects/<PROJECT_ID>/locations/<CLUSTER_ZONE>/clusters/<CLUSTER_NAME>)** as identity provider.

* Add a Condition to trust GSA’s identity via sub or aud.

### Step 7: Configure Web Identity Credentials Provider in Pod

* In your GKE pod, use aws-sdk, boto3, or CLI with AWS\_WEB\_IDENTITY\_TOKEN\_FILE and AWS\_ROLE\_ARN.

### Step 8: Deploy Pod with Projected Token

* Mount the GCP-issued identity token into the pod using serviceAccountName.

{: .important}

> Pod uses this token to authenticate with AWS STS and assume the IAM role.

### Step 9: Test AWS Access from Pod

* Use AWS CLI or SDK (e.g., aws s3 ls) inside the pod to validate access.

---

## 🧪 Aftermath & Observations

After deploying the pod, we ran into a few errors around token audience mismatch and missing IAM trust permissions. Once corrected:

✅ The pod could assume the AWS role using the token file
✅ The pod successfully listed all the S3 buckets

```bash
AWS CLI installed. Listing S3 buckets...
<bucket-name-1>
<bucket-name-2>
S3 list command completed. Pod will sleep now...
```

This was **zero secrets** authentication working in production. 🎯

---

## 🧰 See Full Implementation in Steps Below

## ✅ Step 1: Verify Workload Identity on GKE Cluster

```bash
gcloud container clusters describe <CLUSTER_NAME> \
  --region <REGION> \ # like asia-south1-a
  --format="value(workloadIdentityConfig.workloadPool)"
```

Expected Output:

```bash
<PROJECT_ID>.svc.id.goog
```

---

## ✅ Step 2: Create and Annotate GSA + KSA

### Create Kubernetes Namespace

```bash
kubectl create ns gke-to-aws-test
```

### Create GSA ( Google Service Account if not already created):

```bash
gcloud iam service-accounts create gke-to-aws-test \
  --description="Used by GKE pods via Workload Identity" \
  --display-name="GKE Pod Accessor"
```

### Allow GSA to impersonate:

```bash
gcloud iam service-accounts add-iam-policy-binding gke-to-aws-test@<PROJECT_ID>.iam.gserviceaccount.com \
  --role roles/iam.workloadIdentityUser \
  --member "serviceAccount:<PROJECT_ID>.svc.id.goog[gke-to-aws-test/gke-service-account]"
```

### Create KSA (Kubernetes Service Account & Annotate)

```bash
vim gke-service-account.yaml
```

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gke-service-account
  namespace: gke-to-aws-test
  annotations:
    iam.gke.io/gcp-service-account: gke-to-aws-test@<PROJECT_ID>.iam.gserviceaccount.com
```

```bash
kubectl apply -f gke-service-account.yaml
```

---

## ✅ Step 3: Create AWS OIDC Provider Web Identity Federation

```bash
GKE_OIDC_ISSUER_URI="https://container.googleapis.com/v1/projects/<PROJECT_ID>/locations/<CLUSTER_ZONE>/clusters/<CLUSTER_NAME>"

# Extract the hostname
GKE_OIDC_ISSUER_HOST=$(echo "$GKE_OIDC_ISSUER_URI" | sed -e 's|^[^/]*//||' -e 's|/.*$||')

# Get the thumbprint for the actual GKE OIDC issuer's certificate
THUMBPRINT=$(echo | openssl s_client -servername "${GKE_OIDC_ISSUER_HOST}" -showcerts -connect "${GKE_OIDC_ISSUER_HOST}":443 2>/dev/null | openssl x509 -fingerprint -noout | sed 's/://g' | awk -F= '{print tolower($2)}')

echo "GKE OIDC Issuer URI: $GKE_OIDC_ISSUER_URI"
echo "Correct Thumbprint: $THUMBPRINT"
```

---

```bash
aws iam create-open-id-connect-provider \
    --url "${GKE_OIDC_ISSUER_URI}" \
    --client-id-list "sts.amazonaws.com" \
    --thumbprint-list "${THUMBPRINT}"
```


## ✅ Step 4: Now Create an AWS IAM Role & Configure it for Web Identity Federation

### Create IAM Role Trust Policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/container.googleapis.com/v1/projects/<PROJECT_ID>/locations/<CLUSTER_ZONE>/clusters/CLUSTER_NAME"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "container.googleapis.com/v1/projects/<PROJECT_ID>/locations/<CLUSTER_ZONE>/clusters/CLUSTER_NAME:aud": "sts.amazonaws.com",
                    "container.googleapis.com/v1/projects/<PROJECT_ID>/locations/<CLUSTER_ZONE>/clusters/CLUSTER_NAME:sub": "system:serviceaccount:gke-to-aws-test:gke-service-account"
                }
            }
        }
    ]
}
```

### Attach S3 Access Policy to the role (example):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "*"
    }
  ]
}
```

---

## ✅ Step 4: Create Test Pod to Validate Access

```bash
vim aws-access-test.yaml
```

### Pod YAML:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: aws-access-test
  namespace: gke-to-aws-test
spec:
  serviceAccountName: gke-service-account
  containers:
    - name: awscli
      image: amazonlinux:2
      command: [ "/bin/sh", "-c" ]
      args:
        - |
          yum update -y && yum install -y aws-cli;
          echo "AWS CLI installed. Listing S3 buckets...";
          aws s3 ls;
          echo "S3 list command completed. Pod will sleep now...";
          sleep 3600;
      env:
        - name: AWS_ROLE_ARN
          value: arn:aws:iam::<AWS_ACCOUNT_ID>:role/gke-to-aws-test
        - name: AWS_WEB_IDENTITY_TOKEN_FILE
          value: /var/run/secrets/tokens/token # Corrected path
        - name: AWS_REGION
          value: ap-south-1
      volumeMounts:
        - name: aws-token
          mountPath: /var/run/secrets/tokens # Corrected mountPath to be a directory
          readOnly: true
  volumes:
    - name: aws-token
      projected:
        sources:
        - serviceAccountToken:
            path: token # The actual token file will be named 'token' inside the mountPath
            expirationSeconds: 3600
            audience: sts.amazonaws.com # Correct audience for AWS STS
```

---

## ✅ Step 5: Deploy and Verify

```bash
kubectl apply -f aws-access-test.yaml
kubectl logs aws-access-test -n gke-to-aws-test -f
```

Expected Output:

```
AWS CLI installed. Listing S3 buckets...
<bucket-names>
S3 list command completed. Pod will sleep now...
```

---

## 🧪 Next: Deploy Python App Using boto3

You can now deploy a custom app using the same token mechanism to use AWS services securely via IAM Role federation.

```bash
mkdir python-app && cd python-app
touch Dockerfile  list_buckets.py
```

>> list_buckets.py

```python
import boto3
import botocore

def list_s3_buckets():
    try:
        s3 = boto3.client("s3")
        response = s3.list_buckets()
        print("✅ S3 Buckets:")
        for bucket in response["Buckets"]:
            print(f" - {bucket['Name']}")
    except botocore.exceptions.ClientError as e:
        print(f"❌ Error listing buckets: {e}")

if __name__ == "__main__":
    list_s3_buckets()
```

>> Dockerfile

```Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY list_buckets.py .

RUN pip install boto3

CMD ["python", "list_buckets.py"]
```

```bash
docker build -t <DOCKER_REGISTRY_USERNAME>/python-list-s3-buckets:v1 .
docker push <DOCKER_REGISTRY_USERNAME>/python-list-s3-buckets:v1
```

### Pod YAML:

>> python-app-pod.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gcs-python-app
  namespace: gke-to-aws-test
spec:
  serviceAccountName: gke-service-account
  containers:
  - name: python-gcs
    image: <DOCKER_REGISTRY_USERNAME>/python-list-s3-buckets:v1
    imagePullPolicy: Always
    env:
      - name: AWS_ROLE_ARN
        value: arn:aws:iam::<AWS_ACCOUNT_ID>:role/gke-to-aws-test
      - name: AWS_WEB_IDENTITY_TOKEN_FILE
        value: /var/run/secrets/tokens/token # Corrected path
    volumeMounts:
      - name: aws-token
        mountPath: /var/run/secrets/tokens # Corrected mountPath to be a directory
        readOnly: true
  volumes:
    - name: aws-token
      projected:
        sources:
        - serviceAccountToken:
            path: token # The actual token file will be named 'token' inside the mountPath
            expirationSeconds: 3600
            audience: sts.amazonaws.com # Correct audience for AWS STS
```


## 🕵️‍♂️ Debugging Identity Token (JWT)

### Where we got to know the *aud* & *sub* used in AWS IAM Role Trust Policy?

After launching the `aws-access-test` pod, run the following to extract the JWT and decode it:

```bash
kubectl exec -n gke-to-aws-test aws-access-test -- cat /var/run/secrets/kubernetes.io/serviceaccount/token > token.jwt
cat token.jwt | cut -d "." -f2 | base64 --decode
```

This gives insight into what AWS expects in the `aud` and `sub` conditions of the IAM role trust policy.
