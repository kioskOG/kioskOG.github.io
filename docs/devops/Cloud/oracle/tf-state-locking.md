---
title: Terraform State File Locking
layout: home
parent: oracle
grand_parent: Cloud Projects
nav_order: 1
description: Enable Terraform State File Locking with Amazon S3 Compatible Backend in OCI
author: Jatin Sharma
permalink: /docs/devops/Cloud/tf-state-locking/
---

{: .note}
>   * This tutorial requires access to Oracle Cloud. To sign up for a free account, see [Get started with Oracle Cloud Infrastructure Free Tier](https://docs.oracle.com/en/learn/cloud_free_tier/index.html) .
   
>   * It uses example values for Oracle Cloud Infrastructure credentials, tenancy, and compartments. When completing your lab, substitute these values with ones specific to your cloud environment.

## Introduction
In the dynamic world of cloud computing, Infrastructure as Code (IaC) has emerged as a crucial approach for organizations seeking to effectively manage their infrastructure. IaC’s key advantage lies in its ability to promote consistency, automation, version control, and collaboration, making it an indispensable element of cloud-native IT strategies.

Terraform stands out as a prominent IaC tool, it stores a depiction of your infrastructure objects and their dependencies in a configuration file named `terraform.tfstate`. In a collaborative environment where multiple team members manage the cloud infrastructure, storing the `terraform.tfstate` locally becomes challenging. To address this, Terraform offers a feature called “Remote Backend” to enable the storage of the state file in a shared location. Some of the backends support tfstate locking while `plan` or `apply` operations run to ensure data integrity and prevent conflicts.


{: .important}
> This tutorial will focus on how to set up the S3 compatible backend and ScyllaDB’s DynamoDB-compatible API to enable state file locking.


## Objectives
* Deploy ScyllaDB to an instance using Docker Compose.

* Configure Terraform S3 compatible backend to support tfstate file locking.


## Prerequisites
* [Sign up](https://www.oracle.com/cloud/free/) or [Sign in](https://docs.oracle.com/en-us/iaas/Content/GSG/Tasks/signingin.htm) to your Oracle Cloud account.

* [OCI Bucket](https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/managingbuckets_topic-To_create_a_bucket.htm) with versioning enabled to store the `terraform.tfstate` file.

* Terraform version should be above 1.6.4 [installed](https://developer.hashicorp.com/terraform/install)


## Task 1: Setup ScyllaDB and enable DynamoDB-compatible API
We will create an ARM based instance, install Docker, and configure and run ScyllaDB.

### Task 1.1: Provision a new instance
   1. Navigate to the [Instances](https://cloud.oracle.com/compute/instances) page in the OCI Console and click *Create Instance* .

   2. Enter the required configuration parameters considering the below recommendations.

       * **Image**: `Oracle Linux 8`

       * **Shape**: `VM.Standard.A1.Flex (1 OCPU, 6 GB RAM)`

       * **Primary VNIC**: `Public Subnet & Assign Public IPv4 Address` (will be used for SSH connectivity)

    {: .note}
    > Note down the public and private IP address of the instance.


### Task 1.2: Install Docker
1. Connect to the Instance via SSH.
```shell
ssh opc@<public-ip-address-of-the-instance>
```

2. Install Docker Engine, containerd, and Docker Compose.
```shell
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl start docker.service
sudo systemctl enable docker.service
sudo usermod -aG docker opc
```

### Task 1.3: Generate Customer Secret Key
The customer secret key is required to access OCI Object Storage using the S3-Compatible API.

1. Navigate to your user profile page in the OCI Console and select [Customer secret keys](https://cloud.oracle.com/identity/domains/my-profile/secret-keys) .
2. Generate a new key, copy the secret key value, and click `Close`.
3. Copy the access key value (second column in this list with the customer secret keys).


### Task 1.4: Configure and start ScyllaDB
1. Create the deployment directory s3-lock.
```shell
mkdir s3-lock
cd s3-lock
```

2. Create the `.env`using the following command.
```shell
AWS_ACCESS_KEY_ID='<ACCESS_KEY>'
AWS_SECRET_ACCESS_KEY='<SECRET_KEY>'
TF_STATE_TABLE='s3-locking-demo'
```

   {: .note}
   > The .env file will be used by the Docker compose to setup ScyllaDB.

3. Create a file `scylladb.Dockerfile` in the directory `scylladb` using the following command.
```shell
FROM scylladb/scylla:latest
RUN echo "alternator_enforce_authorization: true" >> /etc/scylla/scylla.yaml
ENTRYPOINT ["/docker-entrypoint.py"]
```

4. Create the `docker-compose.yaml` file in the `s3-lock` directory using the following command.

```yaml
version: "3.3"

services:
  scylladb:
    build:
      dockerfile: scylladb.Dockerfile
      context: ./scylladb
    image: "local-scylla:latest"
    container_name: "scylladb"
    restart: always
    command: ["--alternator-port=8000", "--alternator-write-isolation=always"]
    ports:
      - "8000:8000"
      - "9042:9042"

  scylladb-load-user:
    image: "scylladb/scylla:latest"
    container_name: "scylladb-load-user"
    depends_on:
      - scylladb
    entrypoint: /bin/bash -c "sleep 60 && echo loading cassandra keyspace && cqlsh scylladb -u cassandra -p cassandra \
                              -e \"INSERT INTO system_auth.roles (role,can_login,is_superuser,member_of,salted_hash) \
                              VALUES ('${AWS_ACCESS_KEY_ID}',True,False,null,'${AWS_SECRET_ACCESS_KEY}');\""

  scylladb-create-table:
    image: "amazon/aws-cli"
    container_name: "create_table"
    depends_on:
      - scylladb
    env_file: .env
    entrypoint: /bin/sh -c "sleep 70 && aws dynamodb create-table --table-name ${TF_STATE_TABLE} \
                            --attribute-definitions AttributeName=LockID,AttributeType=S \
                            --key-schema AttributeName=LockID,KeyType=HASH --billing-mode=PAY_PER_REQUEST \
                            --region 'None' --endpoint-url=http://scylladb:8000"

```

5. Review the directory structure.

```shell
$ tree -a .
.
├── docker-compose.yaml
├── .env
└── scylladb
    └── scylladb.Dockerfile

1 directory, 3 files
```

6. Start ScyllaDB service.
```shell
docker compose up -d
```

7. Allow inbound connections to port `8000`.
```shell
sudo firewall-cmd --add-port 8000/tcp --permanent
```

8. Validate connection to the ScyllaDB.
   * Install `python3-pip` and `boto3` package.
   
```shell
sudo yum install -y python3-pip
python3 -m pip install --user boto3
```


   * Create the file `script.py` using the following command.

```py
import boto3

endpoint_url = 'http://localhost:8000'
aws_access_key_id = '<ACCESS_KEY>'
aws_secret_access_key = '<SECRET_KEY>'
table_name = "s3-locking-demo"

client = boto3.client('dynamodb', endpoint_url=endpoint_url, region_name="None",
                aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

response = client.describe_table(TableName=table_name)

print(response["Table"]["TableName"], response["Table"]["TableStatus"])
```

   * Execute the script using the following command.
```shell
python3 script.py
```

{: .note}
> If the script execution returns s3-locking-demo ACTIVE, it is working as expected.


## Task 2: Configure OCI API Gateway to secure connections to the ScyllaDB DynamoDB-compatible API
In this task, we will configure OCI API Gateway to take advantage of the TLS encryption between the users and the ScyllaDB.

### Task 2.1: Create a new API Gateway

1. Navigate to the [API Gateway page](https://cloud.oracle.com/api-gateway/gateways) in the OCI Console and click **Create Gateway** .

   * Name: `s3-locking`
   * Type: `public`
   * Network: `Same VCN and Subnet as the ScyllaDB instance`
   * Certificate: `Default` (`*.oci.oci-customer.com`)

2. Write down the hostname associated with the new created API Gateway. The hostname is displayed in the **Gateway information** tab when you click the new created API Gateway resource.

**For example**: `fj4etyuvz3s57jdsadsadsadsa.apigateway.eu-frankfurt-1.oci.customer-oci.com`

### Task 2.2: Create a new API Gateway deployment

1. Create a new deployment.

  a. Click the new created API Gateway, and in the left-side menu, click `Deployments` under `Resources`.

  b. Click `Create Deployment` and create new deployment using the following information.

   * Basic Information

       * **Name**: `default`
       * **Path prefix**:`/`

   * Authentication: `No Authentication`

   * Routes
      * **Path**: `/{requested_path*}`
      * **Methods**: `ANY`
      * **Backend Type**: `HTTP`
      * **URL**: `http://<private_ip_address_of_the_instance>:8000/${request.path[requested_path]}`

  c. Go to Route Request Policies, Header Transformations and click Add.

    * **Action**: `Set`
    * **Behavior**: `Overwrite`
    * **Header Name**: `Host`
    * **Values**: `<API Gateway hostname>` (For example: fj4etyuvz3s57jdsadsadsadsa.apigateway.eu-frankfurt-1.oci.customer-oci.com)

  d. Review the details of the new deployment and click **Create** .

2. Set up subnet security list to allow ingress and egress connection to port 8000.

    a. Get the CIDR block allocated to the subnet in use, using the following steps.

    b. Identify the security list associated with the subnet used by the instance using the following steps.

    c. Click the default security list already associated with the subnet and add the following rules.

       * Ingress

          *  **Source CIDR**: `0.0.0.0/0`
            * **Protocol**: `TCP`
            * **Destination Port Range**: `443`
            * **Description**: `Ingress Access to the API Gateway`

        * Ingress
            * **Source CIDR**: `<subnet CIDR>`
            * **Protocol**: `TCP`
            * **Destination Port Range**: `8000`
            * **Description**: `Ingress connection to the ScyllaDB`

        * Egress
            * **Destination CIDR**: `<subnet CIDR>`
            * **Protocol**: `TCP`
            * **Destination Port Range**: `8000`
            * **Description**: `Egress connection from the API Gateway backend to ScyllaDB`

### Task 2.3: Validate the connection to the ScyllaDB via the API Gateway
1. Update the `endpoint_url` in the file `script.py` to use the API Gateway hostname. For example: `endpoint_url = "https://fj4etyuvz3s57jdsadsadsadsa.apigateway.eu-frankfurt-1.oci.customer-oci.com"`

2. Run the script to test the connection to the public endpoint.
```shell
python3 script.py
# s3-locking-demo ACTIVE
```

### Task 3: Test terraform.tfstate file locking when using S3-Compatible API
We will execute the following steps on the instance where we want to run the terraform code.

2. Copy the following lines and create the file `main.tf`.

```hcl
resource "null_resource" "hello_world" {
  provisioner "local-exec" {
    command = "echo Hello World"
  }

  provisioner "local-exec" {
    command = "echo 'sleeping for 30 seconds';sleep 30;echo 'done';"
  }

  triggers = {
    run_always = "${timestamp()}"
  }
}
```

2. Configure the S3 backend.

```hcl
terraform {
  backend "s3" {
    bucket = "<bucket-name>" # e.g.: bucket = "sample-bucket"
    region = "<oci-region>"  # e.g.: region = "eu-frankfurt-1"

    skip_region_validation      = true
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    # skip_requesting_account_id  = true
    # skip_s3_checksum            = true

    force_path_style = true
    # use_path_style = true
    # insecure       = true

    # For best practice on how to set credentials access: https://developer.hashicorp.com/terraform/language/settings/backends/s3#access_key

    access_key = "<ACCESS_KEY>"
    secret_key = "<SECRET_KEY>"

    # endpoints = {
    #   # To determine <objectostrage_namespace> access: https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/understandingnamespaces.htm
    #   s3       = "https://<objectstorage_namespace>.compat.objectstorage.<oci-region>.oraclecloud.com"
    #   # e.g.: s3 = https://axaxnpcrorw5.compat.objectstorage.eu-frankfurt-1.oraclecloud.com

    #   # ScyllaDB TLS endpoint, configured using the API Gateway:
    #   dynamodb = "https://<API_Gateway_hostname>"
    #   # e.g.: dynamodb = "https://fj4etyuvz3s57jdsadsadsadsa.apigateway.eu-frankfurt-1.oci.customer-oci.com"
    # }

    # ScyllaDB TLS endpoint, configured using the API Gateway:
    dynamodb_endpoint = "https://<API_Gateway_hostname>"
    # e.g.: dynamodb_endpoint = "https://fj4etyuvz3s57jdsadsadsadsa.apigateway.eu-frankfurt-1.oci.customer-oci.com"
    key            = "demo.tfstate" # the name of the tfstate file
    dynamodb_table = "s3-locking-demo" # the name of the table in the ScyllaDB
  }
}
```

{: .note}
> Example File
>
```hcl
terraform {
  backend "s3" {
    bucket   = "terraform-state-lock-poc"
    key      = "demo.tfstate"
    region   = "me-jeddah-1"
    endpoint = "https://axegchrnyazu.compat.objectstorage.me-jeddah-1.oraclecloud.com"
    #shared_credentials_file     = "~/.aws/credentials"
    access_key = "b5600d5655b4f95e9e8f3c9a16fe5d67c6757aa6"
    secret_key = "a2ne3tJDVM2yFrtYW/HZeTGv5b5/VS8z9y+xiB5CEVU="
    profile = "default"
    skip_region_validation      = true
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    force_path_style            = true
    dynamodb_endpoint = "https://dgbkqtv6jnxw4bdhbahcnmnvjq.apigateway.me-jeddah-1.oci.customer-oci.com"
    dynamodb_table = "terraform-state-lock-poc"
  }
}
```
>

3. Initialize the working directory with terraform init command.

```shell
$ terraform init

Initializing the backend...

Successfully configured the backend "s3"! Terraform will automatically
use this backend unless the backend configuration changes.

Initializing provider plugins...
- Finding latest version of hashicorp/null...
- Installing hashicorp/null v3.2.2...
- Installed hashicorp/null v3.2.2 (signed by HashiCorp)

Terraform has created a lock file .terraform.lock.hcl to record the provider
selections it made above. Include this file in your version control repository
so that Terraform can guarantee to make the same selections by default when
you run "terraform init" in the future.

Terraform has been successfully initialized!
```

4. Execute terraform apply.

```shell
$ terraform apply

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # null_resource.hello_world will be created
  + resource "null_resource" "hello_world" {
      + id       = (known after apply)
      + triggers = {
          + "run_always" = (known after apply)
        }
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

null_resource.hello_world: Creating...
null_resource.hello_world: Provisioning with 'local-exec'...
null_resource.hello_world (local-exec): Executing: ["/bin/sh" "-c" "echo Hello World"]
null_resource.hello_world (local-exec): Hello World
null_resource.hello_world: Provisioning with 'local-exec'...
null_resource.hello_world (local-exec): Executing: ["/bin/sh" "-c" "echo 'sleeping for 30 seconds';sleep 30;echo 'done';"]
null_resource.hello_world (local-exec): sleeping for 30 seconds
null_resource.hello_world: Still creating... [10s elapsed]
null_resource.hello_world: Still creating... [20s elapsed]
null_resource.hello_world: Still creating... [30s elapsed]
null_resource.hello_world (local-exec): done
null_resource.hello_world: Creation complete after 30s [id=5722520729023050684]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

5. Test `terraform.tfstate` file locking. If you attempt to execute `terraform plan` or `terraform apply` during the execution of task 3.4, your request will be rejected.

```shell
$ terraform apply
╷
│ Error: Error acquiring the state lock
│
│ Error message: operation error DynamoDB: PutItem, https response error StatusCode: 400, RequestID: ,
│ ConditionalCheckFailedException: Failed condition.
│ Lock Info:
│   ID:        69309f13-d9fc-8c6b-9fbe-73639b340539
│   Path:      sample-bucket/demo.tfstate
│   Operation: OperationTypeApply
│   Who:       use
│   Version:   1.6.4
│   Created:   2023-12-14 11:31:30.291168816 +0000 UTC
│   Info:
│
│
│ Terraform acquires a state lock to protect the state from being written
│ by multiple users at the same time. Please resolve the issue above and try
│ again. For most commands, you can disable locking with the "-lock=false"
│ flag, but this is not recommended.
```

6. Manage entries in the ScyllaDB tables using DynamoDB API. If you need to list the entries in the DynamoDB table or manually remove entries you can add the following lines at the end of the `script.py` file.

```shell
scan_response = client.scan(
    TableName=table_name,
)

print(scan_response)

entry_to_delete = input("what is the LockID value you would like to delete? ")

delete_response = client.delete_item(
    Key={
        'LockID': {
            'S': f'{entry_to_delete}',
        },
    },
    TableName=table_name
    )

print(delete_response)
```


## Related Links
[Create an Instance](https://docs.oracle.com/en-us/iaas/Content/Compute/Tasks/launchinginstance.htm)

[Overview of OCI API Gateway](https://docs.oracle.com/en-us/iaas/Content/APIGateway/Concepts/apigatewayoverview.htm)

[Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)

[Sign in to the Oracle Cloud Infrastructure Console](https://docs.oracle.com/en-us/iaas/Content/GSG/Tasks/signingin.htm)

[ScyllaDB homepage](https://www.scylladb.com/)

[Terraform S3 Backend](https://developer.hashicorp.com/terraform/language/settings/backends/s3)