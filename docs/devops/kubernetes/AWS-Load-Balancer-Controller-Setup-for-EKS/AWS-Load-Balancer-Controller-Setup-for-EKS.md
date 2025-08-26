---
title: AWS Load Balancer Controller Setup for EKS
layout: default
parent: Kubernetes Projects
nav_order: 16
permalink: /docs/devops/kubernetes/AWS-Load-Balancer-Controller-Setup-for-EKS/
description: Documentation on AWS Load Balancer Controller Setup for EKS.
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS Load Balancer Controller Setup | Jatin Sharma</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        /* Root variables for theming - Aligned across all pages */
        :root {
            --primary-color: #ffb347; /* Orange/Yellow accent for main highlights */
            --light-primary-shade: #ffd97d; /* Lighter shade for gradients */
            --bg-dark: #1e1f26; /* General dark background, used for text and some elements */
            --text-dark: #e0e0e0; /* Light text color for readability on dark backgrounds */
            --card-bg-dark: rgba(25, 25, 34, 0.7); /* Background for main content containers (glass effect) */
            --section-bg-dark: rgba(25, 25, 34, 0.6); /* Background for inner sections (glass effect) */
            --form-bg-dark: rgba(13, 13, 16, 0.7); /* Background for form elements */
            --code-bg-dark: rgba(13, 13, 16, 0.7); /* Background for code blocks and tables */
            
            /* Accent colors, used for secondary highlights, borders, and icons */
            --accent-purple: #9c27b0; 
            --accent-pink: #ff0080;

            /* Project specific colors (from Home page projects) */
            --project-gold: #e0b423; 
            --project-purple: #9c27b0; 
            --project-orange: #ec5e07; 
            --project-red: #e01212;
            --project-teal: #1dd189;
            --project-brown: #d34d05;
            --project-coral: #ff8c00; 
        }

        /* Base Body Styling - Applied globally */
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

        /* Animated gradient text style for main page headings (e.g., Welcome, About Me, Contact Me) */
        .gradient-header {
            background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color));
            background-size: 600% 600%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientMove 8s ease infinite;
            margin-top: 40px;
            margin-bottom: 10px;
        }
        @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

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

        /* Profile Image (used on Home and About Me pages) */
        .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--primary-color);
            margin-bottom: 25px; 
            box-shadow: 0 0 15px rgba(var(--primary-color), 0.4);
            animation: glow 3s ease-in-out infinite;
        }

        /* General Headings and Paragraphs */
        h1 { /* This specifically targets H1s outside .welcome-gradient, if any */
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
            text-align: left; /* Default text alignment for most content */
            list-style-type: none; /* Ensure paragraphs do not have default list styling */
            padding-left: 0;
        }
        strong {
            color: var(--primary-color); /* Highlight strong text with primary color */
        }

        /* Custom paragraph style for skill lists (from About Me) */
        .skill-list-paragraph {
            text-align: left;
            margin-left: 0; 
            padding-left: 0;
            margin-bottom: 15px;
            color: inherit;
            line-height: 1.6;
            font-size: 1.05em;
        }
        .skill-list-paragraph strong {
             color: var(--primary-color);
        }

        /* Global Button Style - Used for main navigation buttons and form submissions */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center; /* Center content horizontally */
            background: linear-gradient(90deg, var(--light-primary-shade) 0%, var(--primary-color) 50%, var(--light-primary-shade) 100%);
            color: #1d2329; /* Dark text for contrast on light orange */
            padding: 13px 34px; 
            border-radius: 30px; 
            text-decoration: none;
            font-size: 20px; 
            font-weight: 600;
            box-shadow: 0 2px 18px rgba(var(--light-primary-shade), 0.6);
            border: none;
            outline: none;
            transition: background 0.24s, color 0.15s, box-shadow 0.21s, transform 0.2s ease-in-out;
            animation: pulse 2s infinite;
            margin: 10px; 
        }
        .btn i {
            margin-left: 9px;
            font-size: 1.16em;
        }
        .btn:hover, .btn:focus {
            background: linear-gradient(90deg, var(--primary-color) 0%, var(--light-primary-shade) 60%, var(--primary-color) 100%);
            color: #23272f; /* Slightly darker text on hover */
            box-shadow: 0 4px 24px rgba(var(--primary-color), 0.56);
            transform: translateY(-2px);
        }

        /* Specific styling for form submit buttons to inherit .btn properties */
        form button[type="submit"] {
            all: unset; /* Reset all default button styles */
            cursor: pointer;
            text-align: center;
            max-width: 280px; /* Constrain width for form buttons */
            letter-spacing: 0.5px;
            /* Inherits .btn styles automatically */
        }

        /* Social Icons / Badges - Unified styling */
        .social-icons, .social-badges { 
            margin-top: 25px;
            margin-bottom: 35px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
        }
        .social-icons a, .social-badges a {
            display: inline-block;
            vertical-align: middle;
            border-radius: 5px;
            transition: transform 0.2s ease-in-out;
        }
        .social-icons a:hover, .social-badges a:hover {
            transform: translateY(-3px);
        }
        .social-icons img, .social-badges img {
            border-radius: 5px;
        }


        /* Section Styling - Applied to all major content blocks */
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
            max-width: 850px; /* Common max-width for inner sections */
            margin-left: auto;
            margin-right: auto;
        }
        .section h2 {
            color: var(--primary-color);
            margin-bottom: 25px;
            text-align: center;
            font-size: 2.2em;
            letter-spacing: 2px;
            text-shadow: 0 0 8px rgba(var(--primary-color), 0.2);
            display: flex; 
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
            text-align: left;
            display: flex;
            align-items: center;
            gap: 10px;
        }


        /* Form Specific Styling (from Contact Me) */
        form {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 25px;
          padding: 25px;
          background-color: var(--form-bg-dark); 
          border-radius: 10px;
          border: 1px solid rgba(var(--primary-color), 0.2); 
          box-shadow: 0 2px 7px rgba(0, 0, 0, 0.35);
        }

        form label {
          font-size: 1.15em;
          font-weight: bold;
          color: var(--primary-color);
          margin-bottom: 5px;
          text-align: left;
        }

        form input[type="text"],
        form input[type="email"],
        form textarea {
          padding: 14px;
          border: 1px solid rgba(var(--primary-color), 0.4);
          border-radius: 8px;
          background-color: rgba(42, 42, 53, 0.8);
          color: var(--text-dark);
          font-size: 1em;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
        }

        form input[type="text"]:focus,
        form input[type="email"]:focus,
        form textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 12px rgba(var(--primary-color), 0.7);
          background-color: rgba(51, 51, 64, 0.9);
        }

        form textarea {
          resize: vertical;
          min-height: 120px;
        }


        /* Projects Section Specific Styling (from Home page) */
        .projects-section {
            /* Inherits .section styling */
        }
        .projects-section h2 {
            /* Inherits .section h2 styling */
        }
        .project-title {
            margin-top: 25px;
            margin-bottom: 5px;
            font-size: 1.4em;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .project-title[data-c="gold"] {
          color: var(--project-gold);
        }
        .project-title[data-c="purple"] {
          color: var(--project-purple);
        }
        .project-title[data-c="orange"] {
          color: var(--project-orange);
        }
        .project-title[data-c="red"] {
          color: var(--project-red);
        }
        .project-title[data-c="teal"] {
          color: var(--project-teal);
        }
        .project-title[data-c="brown"] {
          color: var(--project-brown);
        }
        .project-title[data-c="coral"] {
          color: var(--project-coral);
        }

        .project-link {
            color: #1d2329; /* Text color inside button */
            text-decoration: none;
            font-weight: 600;
            padding: 8px 18px;
            border-radius: 20px;
            background: linear-gradient(90deg, var(--light-primary-shade) 0%, var(--primary-color) 50%, var(--light-primary-shade) 100%);
            margin-left: 10px;
            transition: background 0.24s, color 0.15s, box-shadow 0.21s, transform 0.2s ease-in-out;
            box-shadow: 0 2px 10px rgba(var(--light-primary-shade), 0.6);
            display: inline-flex;
            align-items: center;
        }
        .project-link i {
            margin-left: 5px;
            font-size: 0.9em;
        }
        .project-link:hover {
            background: linear-gradient(90deg, var(--primary-color) 0%, var(--light-primary-shade) 60%, var(--primary-color) 100%);
            color: #23272f;
            box-shadow: 0 4px 18px rgba(var(--primary-color), 0.56);
            transform: translateY(-2px);
        }

        /* Code Block Styling (for technical content pages) */
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

        /* Table Styling (for technical content pages) */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: var(--code-bg-dark);
            border-radius: 8px;
            overflow: hidden; 
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

        /* Image styling (for technical content pages) */
        .content-image {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            margin: 30px auto;
            display: block;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(var(--primary-color), 0.3);
        }

        /* Horizontal Rule - Consistent style */
        hr {
          border: none;
          border-top: 1px solid rgba(var(--primary-color), 0.5); 
          margin-top: 40px;
          margin-bottom: 20px;
        }

        /* Footer link wrapper (from Contact Me) */
        .footer-link-wrapper {
            display: block;
            text-align: center;
            margin-top: 40px;
        }

        /* Animations - Global */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 2px 18px rgba(var(--primary-color), 0.2); }
            50% { box-shadow: 0 4px 28px rgba(var(--primary-color), 0.45); }
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 108, 71, 0.5); }
            70% { box-shadow: 0 0 0 15px rgba(255,179,71,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,179,71,0); }
        }
        @keyframes floatBg {
        from { transform: translate(0,0); }
        to { transform: translate(8px, -8px); }
        }

        /* Responsive adjustments - Global */
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
            p, .skill-list-paragraph {
                font-size: 1em;
                margin-left: 0;
            }
            .btn, form button[type="submit"] {
                padding: 12px 25px;
                font-size: 1em;
                max-width: 180px;
                margin: 5px;
            }
            .skill-category-title, .sub-skill-heading {
                font-size: 1.2em;
                margin-left: 0;
            }
            .container {
                margin: 20px 10px;
                padding: 30px 15px;
            }
            .section {
                padding: 20px;
            }
            .project-title {
                font-size: 1.2em;
                flex-direction: column; 
                gap: 5px;
            }
            .project-link {
                padding: 6px 14px;
                font-size: 0.8em;
                margin-left: 0;
                margin-top: 10px;
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
            <h1 class="welcome-gradient">🚦 AWS Load Balancer Controller Setup for EKS</h1>
        </div>

        <p>
            This guide outlines the steps to install and configure the **AWS Load Balancer Controller** in your Amazon EKS cluster. This controller allows you to use Application Load Balancers (ALBs) and Network Load Balancers (NLBs) directly from Kubernetes, enabling advanced traffic management and seamless integration with AWS services.
        </p>

        <hr>

        <section class="section">
            <h2>🔑 1. Create IAM Role & Service Account for AWS Load Balancer Controller</h2>
            <p>
                The AWS Load Balancer Controller requires specific AWS IAM permissions to manage Elastic Load Balancers (ELB), EC2 security groups, and other related resources on your behalf. We'll set this up using **IAM Roles for Service Accounts (IRSA)**.
            </p>

            <h3>IAM Role Trust Policy: <code>AWSLoadBalancerController</code></h3>
            <p>
                This trust policy allows the Kubernetes Service Account <code>aws-load-balancer-controller</code> to assume an IAM role.
            </p>
            <pre><code>{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::&lt;ACCOUNT-ID&gt;:oidc-provider/oidc.eks.ap-southeast-1.amazonaws.com/id/905FD3625D5E720BDB50A6227B6B654A"
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
}</code></pre>
            <p>
                <ul>
                    <li>Replace <code>&lt;ACCOUNT-ID&gt;</code> with your AWS account ID.</li>
                    <li>Ensure the <code>&lt;OIDC provider URL and ID&gt;</code> match your EKS cluster's configuration.</li>
                </ul>
            </p>

            <h3>IAM Policy: <code>AWSLoadBalancerControllerIAMPolicy</code></h3>
            <p>
                This extensive policy grants the necessary permissions for the controller to create, modify, and delete AWS Load Balancers and related resources. Create an IAM policy with this content and attach it to the IAM role that uses the above trust policy.
            </p>
            <pre><code>{
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
}</code></pre>

            <h3>Kubernetes Service Account Manifest</h3>
            <p>
                Create a Kubernetes Service Account in the <code>kube-system</code> namespace and annotate it with the ARN of the IAM role you just created.
            </p>
            <pre><code>apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::&lt;ACCOUNT-ID&gt;:role/ALBControllerServiceAccountRole # &lt;--- IMPORTANT: Replace &lt;ACCOUNT-ID&gt;
  name: aws-load-balancer-controller
  namespace: kube-system</code></pre>
            <p>Apply this manifest to your cluster:</p>
            <pre><code>kubectl apply -f aws-load-balancer-controller-service-account.yaml</code></pre>
        </section>

        <hr>

        <section class="section">
            <h2>📦 2. Install the AWS Load Balancer Controller using Helm V3</h2>
            <p>We'll use Helm to deploy the controller, which is the recommended method for managing Kubernetes applications.</p>

            <h3>Add EKS Helm Repository</h3>
            <pre><code># Add the eks-charts repository.
helm repo add eks https://aws.github.io/eks-charts

# Update your local repo to make sure that you have the most recent charts.
helm repo update</code></pre>

            <h3>Install the AWS Load Balancer Controller Chart</h3>
            <p>
                Install the controller, ensuring you replace the placeholders with your cluster-specific details.
            </p>
            <pre><code>helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=MillenniumFalcon \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=ap-southeast-1 \
  --set vpcId=vpc-0766b4f77df21b5ce \
  --set image.repository=public.ecr.aws/eks/aws-load-balancer-controller</code></pre>
            <p>
                <code>ClusterRole</code> and <code>ClusterRoleBinding</code> resources are automatically created by the Helm chart.
            </p>
        </section>

        <hr>

        <section class="section">
            <h2>✅ 3. Verify the Controller Installation</h2>
            <p>After installation, it's crucial to verify that the controller and its webhook service are running correctly.</p>

            <h3>Verify Deployment Status</h3>
            <p>Check the deployment status of the controller:</p>
            <pre><code>kubectl -n kube-system get deployment
kubectl -n kube-system get deployment aws-load-balancer-controller
kubectl -n kube-system describe deployment aws-load-balancer-controller</code></pre>

            <h3>Verify Webhook Service</h3>
            <p>Confirm that the AWS Load Balancer Controller Webhook service has been created:</p>
            <pre><code>kubectl -n kube-system get svc
kubectl -n kube-system get svc aws-load-balancer-webhook-service
kubectl -n kube-system describe svc aws-load-balancer-webhook-service</code></pre>

            <h3>Verify Labels</h3>
            <p>Ensure that the labels in the Service and the selector labels in the Deployment match:</p>
            <pre><code>kubectl -n kube-system get svc aws-load-balancer-webhook-service -o yaml
kubectl -n kube-system get deployment aws-load-balancer-controller -o yaml</code></pre>
        </section>

        <hr>

        <section class="section">
            <h2>👀 4. Review Controller Logs & TLS Certificates</h2>

            <h3>Verify AWS Load Balancer Controller Logs</h3>
            <p>Monitoring the controller's logs is essential for troubleshooting and ensuring its proper operation:</p>
            <pre><code># List Pods
kubectl get pods -n kube-system

# Review logs for a specific AWS LB Controller POD
kubectl -n kube-system logs -f &lt;POD-NAME&gt;

# To get logs from all pods matching a pattern
kubectl get pods -n kube-system -o name | grep "aws-load-balancer-controller" | xargs -I {} kubectl logs {} -n kube-system -f</code></pre>
            <p>Replace <code>&lt;POD-NAME&gt;</code> with the name of one of your controller pods.</p>

            <h3>Verify TLS Certs for AWS Load Balancer Controller - Internals</h3>
            <p>The controller uses a TLS certificate for its webhook. You can inspect this secret:</p>
            <pre><code># List aws-load-balancer-tls secret
kubectl -n kube-system get secret aws-load-balancer-tls -o yaml</code></pre>
            <p>You can then decode <code>ca.crt</code> and <code>tls.crt</code> using online tools to verify their contents:</p>
            <ul>
                <li><a href="https://www.base64decode.org/" target="_blank" rel="noopener">Base64 Decoder <i class="fas fa-external-link-alt"></i></a></li>
                <li><a href="https://www.sslchecker.com/certdecoder" target="_blank" rel="noopener">SSL Certificate Decoder <i class="fas fa-external-link-alt"></i></a></li>
            </ul>
        </section>

        <hr>

        <section class="section">
            <h2>📚 Reference</h2>
            <p>For more detailed information, refer to the official AWS Load Balancer Controller documentation:</p>
            <p style="text-align: center;">
                <a href="https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/ingress/ingress_class/" target="_blank" rel="noopener" class="btn">
                    Official Documentation <i class="fas fa-book-open"></i>
                </a>
            </p>
        </section>

    </div>
</body>
</html>
