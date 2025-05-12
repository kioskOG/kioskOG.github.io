---
title: Accessing GCS from GKE Pods using Workload Identity
layout: home
parent: Google Cloud Platform
grand_parent: Cloud Projects
nav_order: 2
author: Jatin Sharma
permalink: /docs/devops/Cloud/Gcp/Accessing-GCS-from-GKE-Pods-using-Workload-Identity/
description: Documentation for Accessing GCS from GKE Pods using Workload Identity.
---

# Accessing GCS from GKE Pods using Workload Identity

This guide walks through configuring **Workload Identity** to allow GKE pods written in **Python**, **Node.js**, and **Java** to access **Google Cloud Storage (GCS)** **without using service account keys**.

---

## ✅ Prerequisites

* Existing GKE Cluster with Workload Identity enabled
* `gcloud` CLI and `kubectl` configured
* A GCS bucket
* Docker Hub account for pushing images

---

## 🔧 Step 1: Verify Workload Identity is Enabled

```bash
gcloud container clusters list \
  --filter="name:<CLUSTER_NAME>" \
  --format="table[box](name, location, workloadIdentityConfig.workloadPool)"
```

Expected output:

```
┌────────────┬───────────────┬──────────────────────────┐
│    NAME    │    LOCATION   │      WORKLOAD_POOL       │
├────────────┼───────────────┼──────────────────────────┤
│ qa-cluster │ asia-south1-a │ <project_id>.svc.id.goog │
└────────────┴───────────────┴──────────────────────────┘
```



## 🔧 Step 1.1: Confirm Kubernetes Nodes Use GCP Metadata Server

Log into any node and check for /var/run/secrets/kubernetes.io/serviceaccount/token and curl this from within a pod:

```bash
curl -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/email
```

{: .note}
> If you get a valid response (like a GSA email), then the identity plumbing works.

---

## 🔹 Step 2: Create Google Service Account (GSA)

```bash
export PROJECT_ID="bikes-272910"
export GSA_NAME=gke-pod-accessor

gcloud iam service-accounts create $GSA_NAME \
  --description="Used by GKE pods via Workload Identity" \
  --display-name="GKE Pod Accessor"
```

---

## 🔹 Step 3: Grant GCS Permissions to GSA

```bash
gcloud projects add-iam-policy-binding <PROJECT_ID> \
  --member="serviceAccount:gke-pod-accessor@<PROJECT_ID>.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"


# For GCS (read)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"
```
---

## 🔹 Step 4: Bind KSA to GSA

```bash
# Replace these as needed
export NAMESPACE=workload-namespace
export KSA_NAME=k8-serviceaccount

gcloud iam service-accounts add-iam-policy-binding $GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:$PROJECT_ID.svc.id.goog[$NAMESPACE/$KSA_NAME]"
```

## 🔹 Step 5: Create and Annotate the Kubernetes Service Account

```bash
kubectl create serviceaccount $KSA_NAME --namespace $NAMESPACE

kubectl annotate serviceaccount \
  $KSA_NAME \
  --namespace $NAMESPACE \
  iam.gke.io/gcp-service-account=$GSA_NAME@$PROJECT_ID.iam.gserviceaccount.com


kubectl get serviceaccount -n $NAMESPACE $KSA_NAME -oyaml
```


## 🔹 Confirm KSA → GSA Mapping Works (Dry Run)

```bash
gcloud iam service-accounts get-iam-policy gke-pod-accessor@bikes-272910.iam.gserviceaccount.com --format=json
```

Expected output:-

```json
{
  "bindings": [
    {
      "members": [
        "serviceAccount:bikes-272910.svc.id.goog[workload-namespace/k8-serviceaccount]"
      ],
      "role": "roles/iam.workloadIdentityUser"
    }
  ],
  "etag": "BwY06eKCIIw=",
  "version": 1
}
```

🔹 Step 6: Use This KSA in Your Pod

vim gcp-access-test.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gcp-access-test
  namespace: workload-namespace
spec:
  serviceAccountName: k8-serviceaccount
  containers:
  - name: app
    image: google/cloud-sdk:slim
    command: ["/bin/sh"]
    args: ["-c", "gsutil ls gs://your-bucket-name"]
```

```bash
kubectl apply -f gcp-access-test.yaml

kubectl get pods -n $NAMESPACE

kubectl logs gcp-access-test -n $NAMESPACE -f
```

>> Example output:-

```bash
gs://signoz-archive/data/aaa/
gs://signoz-archive/data/aab/
gs://signoz-archive/data/aac/
gs://signoz-archive/data/aad/
gs://signoz-archive/data/aae/
gs://signoz-archive/data/aaf/
gs://signoz-archive/data/aag/
gs://signoz-archive/data/aah/
gs://signoz-archive/data/aal/
gs://signoz-archive/data/aam/
gs://signoz-archive/data/aao/
```

---

## 🐍 Python App

**main.py**

```python
from google.cloud import storage
import os

def list_blobs(bucket_name):
    client = storage.Client()
    blobs = client.list_blobs(bucket_name)
    for blob in blobs:
        print(blob.name)

if __name__ == "__main__":
    bucket = os.environ.get("BUCKET_NAME")
    if not bucket:
        raise Exception("BUCKET_NAME not set")
    list_blobs(bucket)
```

**Dockerfile**

```Dockerfile
FROM python:3.11-slim
RUN pip install google-cloud-storage
COPY main.py /app/main.py
WORKDIR /app
CMD ["python", "main.py"]
```

---

## 🌐 Node.js App

**index.js**

```js
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME;

async function listFiles() {
  if (!bucketName) {
    throw new Error('BUCKET_NAME environment variable not set');
  }

  const [files] = await storage.bucket(bucketName).getFiles();
  files.forEach(file => console.log(file.name));
}

listFiles().catch(console.error);
```

**Dockerfile**

```Dockerfile
FROM node:18-slim
WORKDIR /app
COPY index.js .
RUN npm install @google-cloud/storage
CMD ["node", "index.js"]
```

---

## ☕ Java App

src/main/java/GCSAccess.java
**GCSAccess.java**

```java
import com.google.cloud.storage.*;

public class GCSAccess {
    public static void main(String[] args) {
        Storage storage = StorageOptions.getDefaultInstance().getService();
        String bucketName = "signoz-archive";

        for (Blob blob : storage.list(bucketName).iterateAll()) {
            System.out.println(blob.getName());
        }
    }
}
```

**pom.xml**

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>gcs-access</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>com.google.cloud</groupId>
            <artifactId>google-cloud-storage</artifactId>
            <version>2.27.0</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Include dependencies and main class -->
            <plugin>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>3.3.0</version>
                <configuration>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                    <archive>
                        <manifest>
                            <mainClass>GCSAccess</mainClass>
                        </manifest>
                    </archive>
                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

**Dockerfile**

```Dockerfile
# Stage 1: Build the application and create a fat JAR
FROM maven:3.9.6-eclipse-temurin-17 as builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package

# Stage 2: Use a lightweight Java image to run the app
FROM eclipse-temurin:17

WORKDIR /app

COPY --from=builder /app/target/gcs-access-1.0-SNAPSHOT-jar-with-dependencies.jar app.jar

CMD ["java", "-jar", "app.jar"]
```

---

## 🧩 Kubernetes Pod Manifests (for all apps)

Each pod must use the annotated KSA:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gcs-<lang>-app
  namespace: workload-namespace
spec:
  serviceAccountName: k8-serviceaccount
  containers:
  - name: <lang>-gcs
    image: <Image_Name>
    env:
    - name: BUCKET_NAME
      value: "your-gcs-bucket-name"
```

Replace `<lang>` with `python`, `nodejs`, or `java`.

---

## 🔍 Verification

Inside the pod:

```bash
curl -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/email
```

Should return:

```
gke-pod-accessor@<PROJECT_ID>.iam.gserviceaccount.com
```

Also check logs from each pod to verify GCS access.

---

✅ You’ve now successfully configured Workload Identity for GKE pods to securely access GCS — using native cloud auth, without keys!
