---
title: AWS Load Balancer Controller Setup for EKS
layout: doc-page
parent: Kubernetes Projects
nav_order: 16
permalink: /docs/devops/kubernetes/AWS-Load-Balancer-Controller-Setup-for-EKS/
description: Documentation on AWS Load Balancer Controller Setup for EKS.
---

# 🚦 AWS Load Balancer Controller Setup for EKS

This guide outlines the steps to install and configure the `AWS Load Balancer Controller` in your Amazon EKS cluster. This controller allows you to use Application Load Balancers (ALBs) and Network Load Balancers (NLBs) directly from Kubernetes, enabling advanced traffic management and seamless integration with AWS services.

---

## 🔑 1. Create IAM Role & Service Account for AWS Load Balancer Controller

The AWS Load Balancer Controller requires specific AWS IAM permissions to manage Elastic Load Balancers (ELB), EC2 security groups, and other related resources on your behalf. We'll set this up using \*\*IAM Roles for Service Accounts (IRSA)\*\*.

### IAM Role Trust Policy: `AWSLoadBalancerController`

This trust policy allows the Kubernetes Service Account `aws-load-balancer-controller` to assume an IAM role.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::<ACCOUNT-ID>:oidc-provider/oidc.eks.ap-southeast-1.amazonaws.com/id/905FD3625D5E720BDB50A6227B6B654A"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "oidc.eks.ap-southeast-1.amazonaws.com/id/905FD3625D5E720BDB50A6227B6B654A:aud": "sts.amazonaws.com",
                    "oidc.eks.ap-southeast-1.amazonaws.com/id/905FD3625D5E720BDB50A6227B6B654A:sub": [
                        "system:serviceaccount:kube-system:aws-load-balancer-controller"
                    ]
                }
            }
        }
    ]
}
```

* Replace `<ACCOUNT-ID>` with your AWS account ID.
* Ensure the `<OIDC provider URL and ID>` match your EKS cluster's configuration.

### IAM Policy: `AWSLoadBalancerControllerIAMPolicy`

This extensive policy grants the necessary permissions for the controller to create, modify, and delete AWS Load Balancers and related resources. Create an IAM policy with this content and attach it to the IAM role that uses the above trust policy.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceLinkedRole"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "iam:AWSServiceName": "elasticloadbalancing.amazonaws.com"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeAccountAttributes",
                "ec2:DescribeAddresses",
                "ec2:DescribeAvailabilityZones",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeVpcs",
                "ec2:DescribeVpcPeeringConnections",
                "ec2:DescribeSubnets",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeInstances",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DescribeTags",
                "ec2:GetCoipPoolUsage",
                "ec2:DescribeCoipPools",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeLoadBalancerAttributes",
                "elasticloadbalancing:DescribeListeners",
                "elasticloadbalancing:DescribeListenerCertificates",
                "elasticloadbalancing:DescribeSSLPolicies",
                "elasticloadbalancing:DescribeRules",
                "elasticloadbalancing:DescribeTargetGroups",
                "elasticloadbalancing:DescribeTargetGroupAttributes",
                "elasticloadbalancing:DescribeTargetHealth",
                "elasticloadbalancing:DescribeTags"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:DescribeUserPoolClient",
                "acm:ListCertificates",
                "acm:DescribeCertificate",
                "iam:ListServerCertificates",
                "iam:GetServerCertificate",
                "waf-regional:GetWebACL",
                "waf-regional:GetWebACLForResource",
                "waf-regional:AssociateWebACL",
                "waf-regional:DisassociateWebACL",
                "wafv2:GetWebACL",
                "wafv2:GetWebACLForResource",
                "wafv2:AssociateWebACL",
                "wafv2:DisassociateWebACL",
                "shield:GetSubscriptionState",
                "shield:DescribeProtection",
                "shield:CreateProtection",
                "shield:DeleteProtection"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:RevokeSecurityGroupIngress"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateSecurityGroup"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateTags"
            ],
            "Resource": "arn:aws:ec2:*:*:security-group/*",
            "Condition": {
                "StringEquals": {
                    "ec2:CreateAction": "CreateSecurityGroup"
                },
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateTags",
                "ec2:DeleteTags"
            ],
            "Resource": "arn:aws:ec2:*:*:security-group/*",
            "Condition": {
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:RevokeSecurityGroupIngress",
                "ec2:DeleteSecurityGroup"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:CreateLoadBalancer",
                "elasticloadbalancing:CreateTargetGroup"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:CreateListener",
                "elasticloadbalancing:DeleteListener",
                "elasticloadbalancing:CreateRule",
                "elasticloadbalancing:DeleteRule"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:AddTags",
                "elasticloadbalancing:RemoveTags"
            ],
            "Resource": [
                "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
                "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
                "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*"
            ],
            "Condition": {
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:AddTags",
                "elasticloadbalancing:RemoveTags"
            ],
            "Resource": [
                "arn:aws:elasticloadbalancing:*:*:listener/net/*/*/*",
                "arn:aws:elasticloadbalancing:*:*:listener/app/*/*/*",
                "arn:aws:elasticloadbalancing:*:*:listener-rule/net/*/*/*",
                "arn:aws:elasticloadbalancing:*:*:listener-rule/app/*/*/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:ModifyLoadBalancerAttributes",
                "elasticloadbalancing:SetIpAddressType",
                "elasticloadbalancing:SetSecurityGroups",
                "elasticloadbalancing:SetSubnets",
                "elasticloadbalancing:DeleteLoadBalancer",
                "elasticloadbalancing:ModifyTargetGroup",
                "elasticloadbalancing:ModifyTargetGroupAttributes",
                "elasticloadbalancing:DeleteTargetGroup"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:RegisterTargets",
                "elasticloadbalancing:DeregisterTargets"
            ],
            "Resource": "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:SetWebAcl",
                "elasticloadbalancing:ModifyListener",
                "elasticloadbalancing:AddListenerCertificates",
                "elasticloadbalancing:RemoveListenerCertificates",
                "elasticloadbalancing:ModifyRule"
            ],
            "Resource": "*"
        }
    ]
}
```

### Kubernetes Service Account Manifest

Create a Kubernetes Service Account in the `kube-system` namespace and annotate it with the ARN of the IAM role you just created.

```
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::<ACCOUNT-ID>:role/ALBControllerServiceAccountRole # <--- IMPORTANT: Replace <ACCOUNT-ID>
  name: aws-load-balancer-controller
  namespace: kube-system
```

Apply this manifest to your cluster:

```
kubectl apply -f aws-load-balancer-controller-service-account.yaml
```

---

## 📦 2. Install the AWS Load Balancer Controller using Helm V3

We'll use Helm to deploy the controller, which is the recommended method for managing Kubernetes applications.

### Add EKS Helm Repository

```
# Add the eks-charts repository.
helm repo add eks https://aws.github.io/eks-charts

# Update your local repo to make sure that you have the most recent charts.
helm repo update
```

### Install the AWS Load Balancer Controller Chart

Install the controller, ensuring you replace the placeholders with your cluster-specific details.

```
helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=MillenniumFalcon \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=ap-southeast-1 \
  --set vpcId=vpc-0766b4f77df21b5ce \
  --set image.repository=public.ecr.aws/eks/aws-load-balancer-controller
```

`ClusterRole` and `ClusterRoleBinding` resources are automatically created by the Helm chart.

---

## ✅ 3. Verify the Controller Installation

After installation, it's crucial to verify that the controller and its webhook service are running correctly.

### Verify Deployment Status

Check the deployment status of the controller:

```
kubectl -n kube-system get deployment
kubectl -n kube-system get deployment aws-load-balancer-controller
kubectl -n kube-system describe deployment aws-load-balancer-controller
```

### Verify Webhook Service

Confirm that the AWS Load Balancer Controller Webhook service has been created:

```
kubectl -n kube-system get svc
kubectl -n kube-system get svc aws-load-balancer-webhook-service
kubectl -n kube-system describe svc aws-load-balancer-webhook-service
```

### Verify Labels

Ensure that the labels in the Service and the selector labels in the Deployment match:

```
kubectl -n kube-system get svc aws-load-balancer-webhook-service -o yaml
kubectl -n kube-system get deployment aws-load-balancer-controller -o yaml
```

---

## 👀 4. Review Controller Logs & TLS Certificates

### Verify AWS Load Balancer Controller Logs

Monitoring the controller's logs is essential for troubleshooting and ensuring its proper operation:

```
# List Pods
kubectl get pods -n kube-system

# Review logs for a specific AWS LB Controller POD
kubectl -n kube-system logs -f <POD-NAME>

# To get logs from all pods matching a pattern
kubectl get pods -n kube-system -o name | grep "aws-load-balancer-controller" | xargs -I {} kubectl logs {} -n kube-system -f
```

Replace `<POD-NAME>` with the name of one of your controller pods.

### Verify TLS Certs for AWS Load Balancer Controller - Internals

The controller uses a TLS certificate for its webhook. You can inspect this secret:

```
# List aws-load-balancer-tls secret
kubectl -n kube-system get secret aws-load-balancer-tls -o yaml
```

You can then decode `ca.crt` and `tls.crt` using online tools to verify their contents:

* [Base64 Decoder](https://www.base64decode.org/)
* [SSL Certificate Decoder](https://www.sslchecker.com/certdecoder)

---

## 📚 Reference

For more detailed information, refer to the official AWS Load Balancer Controller documentation:

[Official Documentation](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/ingress/ingress_class/)
