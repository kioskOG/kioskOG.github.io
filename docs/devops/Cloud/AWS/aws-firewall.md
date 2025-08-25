---
title: AWS Network Firewall Egress Filtering with Stateful Suricata Rules – Asymmetric Routing Trap
layout: home
parent: AWS Cloud Platform
grand_parent: Cloud Projects
nav_order: 1
author: Jatin Sharma
permalink: /docs/devops/Cloud/AWS/aws-firewal/
description: Documentation for AWS Network Firewall Egress Filtering with Stateful Suricata Rules – Asymmetric Routing Trap.
---


<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS Network Firewall Egress Filtering | Jatin Sharma</title>
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
            <h1 class="welcome-gradient">🚀 AWS Network Firewall Egress Filtering – Asymmetric Routing Trap ⚠️</h1>
        </div>

        <p>
            Today I deep-dived into setting up <strong>AWS Network Firewall</strong> purely for egress filtering. The architecture involved:
        </p>
        <p style="text-align: center;">
            Private subnets → Firewall endpoint → NAT Gateway → Internet
        </p>
        <p>
            Route tables ensured all outbound traffic from private subnets went through the firewall. This learning focuses on a critical challenge encountered and its resolution.
        </p>

        

        <hr>

        <section class="section">
            <h2>⚙️ Networking Setup</h2>
            <p>We had three key subnets configured:</p>

            <h3>Public Subnet (for NAT & IGW)</h3>
            <table>
                <thead>
                    <tr>
                        <th>Destination</th>
                        <th>Target</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>10.0.0.0/16</td>
                        <td>local</td>
                    </tr>
                    <tr>
                        <td>0.0.0.0/0</td>
                        <td>igw-031872b0c98985551</td>
                    </tr>
                </tbody>
            </table>

            <h3>Private Subnet (workloads)</h3>
            <table>
                <thead>
                    <tr>
                        <th>Destination</th>
                        <th>Target</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>10.0.0.0/16</td>
                        <td>local</td>
                    </tr>
                    <tr>
                        <td>0.0.0.0/0</td>
                        <td>vpce-093bd2b6f096cabd5 (Firewall Endpoint)</td>
                    </tr>
                </tbody>
            </table>

            <h3>Firewall Subnet</h3>
            <table>
                <thead>
                    <tr>
                        <th>Destination</th>
                        <th>Target</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>10.0.0.0/16</td>
                        <td>local</td>
                    </tr>
                    <tr>
                        <td>0.0.0.0/0</td>
                        <td>nat-0382e8c908a281ec2</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <hr>

        <section class="section">
            <h2>⚠️ The Problem: Stateful Suricata Rules Bypass</h2>
            <p>
                We implemented tight stateful Suricata rules within the AWS Network Firewall for egress filtering. Here's a snippet of the rules in use:
            </p>
            <pre><code>reject tls any any -> any any (msg:"Block Facebook.com via SNI"; tls.sni; content:"facebook.com"; nocase; endswith; sid:1000006; rev:1;)
reject tls any any -> any any (msg:"Block google.com via SNI"; tls.sni; content:"google.com"; nocase; endswith; sid:1000007; rev:1;)
reject tls any any -> any any (msg:"Block github.com via SNI"; tls.sni; content:"github.com"; nocase; endswith; sid:1000008; rev:1;)
pass tcp any any -> any any (flow:established; msg:"pass all other TCP traffic"; sid:1000004; rev:2;)</code></pre>
            <p>
                Even with these rules in place, I observed an unexpected behavior:
            </p>
            <pre><code>curl https://www.google.com</code></pre>
            <p>
                executed from my private instance still <strong>succeeded</strong>, indicating that the firewall was not blocking the domain as intended. This was a clear indication that something was missing in the traffic flow.
            </p>
        </section>

        <hr>

        <section class="section">
            <h2>🔍 Root Cause: Asymmetric Routing</h2>
            <p>
                The core issue turned out to be a classic <strong>asymmetric routing problem</strong>.
            </p>
            <ul>
                <li><strong>Egress Traffic Flow</strong>: Outbound traffic from the private subnets was correctly routed: <code>Private subnets → Firewall endpoint → NAT Gateway → Internet</code>.</li>
                <li><strong>Return Traffic Flow</strong>: However, the return traffic from the Internet (via the NAT Gateway) back to the private subnet took a direct, local route: <code>NAT Gateway → Private subnet</code>. This path completely bypassed the firewall endpoint.</li>
            </ul>
            <p>
                Because the AWS Network Firewall did not see both directions of the TCP session, it could not maintain the full state of the connection, nor could it effectively enforce the TLS SNI blocking rules. Consequently, the connection was allowed to succeed despite the explicit block rules.
            </p>
        </section>

        <hr>

        <section class="section">
            <h2>🔄 Understanding Symmetric vs. Asymmetric Routing</h2>
            <p>
                <strong>Symmetric routing</strong> means that both the outbound and return traffic for a given session follow the <strong>exact same path</strong>, ensuring that all packets belonging to a single connection flow through the same firewall (or firewall pair) in both directions.
            </p>
            <h3>1. Asymmetric Routing (The Problem State)</h3>
            <p>
                In an asymmetric routing scenario, the outbound and inbound paths for the same TLS connection do not both traverse the firewall, leading to incomplete session visibility.
            </p>
            <p><strong>Outbound Flow (Client Initiates TLS):</strong></p>
            <ol>
                <li>Your application in the Private Subnet sends a ClientHello message (part of the TLS handshake) to <code>google.com</code>.</li>
                <li>The Private Subnet's Route Table directs this traffic to the Firewall Endpoint.</li>
                <li>The Network Firewall (seeing the ClientHello including SNI: <code>google.com</code>) allows it (if no rules block it outbound) and creates a stateful entry for the connection.</li>
                <li>The Firewall Subnet's Route Table directs the traffic to the NAT Gateway.</li>
                <li>The NAT Gateway forwards the traffic to <code>google.com</code> on the Internet.</li>
            </ol>
            <p><strong>Inbound Flow (TLS Server Responds):</strong></p>
            <ol>
                <li><code>google.com</code> sends back its ServerHello, Certificate, and other TLS handshake messages.</li>
                <li>This return traffic arrives at the NAT Gateway's Elastic IP.</li>
                <li>Because the NAT Gateway's subnet's route table had a direct <code>10.0.0.0/16</code> (VPC CIDR) route to <code>local</code>, the return traffic is sent directly to the Private Subnet.</li>
                <li>The return traffic <strong>bypasses the Network Firewall entirely</strong>.</li>
            </ol>
            <p>
                <strong>Result:</strong> The AWS Network Firewall only saw the outbound ClientHello. It never saw the inbound ServerHello or subsequent encrypted data packets. Since it didn't see the full conversation, its state table for that connection couldn't be fully established, and it could not apply the <code>reject tls ... content:"google.com"</code> rule. From your private instance, <code>curl https://google.com</code> succeeded because the firewall didn't intercept the return traffic.
            </p>

            <h3>2. Symmetric Routing (The Solution State)</h3>
            <p>
                With symmetric routing, both the forward and reverse paths for the TLS connection are explicitly forced through the AWS Network Firewall, ensuring full session inspection.
            </p>
            <p><strong>Outbound Flow (Client Initiates TLS):</strong></p>
            <ol>
                <li>Your application in the Private Subnet sends a ClientHello (containing SNI: <code>google.com</code>).</li>
                <li>The Private Subnet's Route Table directs this traffic to the Firewall Endpoint.</li>
                <li>The Network Firewall (seeing the ClientHello and SNI) processes it.</li>
                <li>The Firewall Subnet's Route Table directs the traffic to the NAT Gateway.</li>
                <li>The NAT Gateway forwards the traffic to <code>google.com</code>.</li>
            </ol>
            <p><strong>Inbound Flow (TLS Server Responds):</strong></p>
            <ol>
                <li><code>google.com</code> sends back its ServerHello, Certificate, etc.</li>
                <li>This return traffic arrives at the NAT Gateway's Elastic IP.</li>
                <li>The NAT Gateway's subnet's route table (which you'll fix) now explicitly directs all return traffic destined for your Private Subnet back to the Firewall Endpoint.</li>
                <li>The Network Firewall now receives the inbound ServerHello and subsequent encrypted packets for the <code>google.com</code> connection.</li>
            </ol>
            <p>
                <strong>Result:</strong> The AWS Network Firewall now sees both sides of the TLS connection. When the ServerHello arrives, it correlates it with the outgoing ClientHello. If your firewall rule is <code>reject tls any any -> any any (tls.sni; content:"google.com"; ...)</code>, the firewall, having seen both sides of the connection and matched the SNI, can now correctly drop or reject the TLS traffic. Your <code>curl https://google.com</code> command from the private instance would now correctly fail as intended.
            </p>
        </section>

        <hr>

        <section class="section">
            <h2>✔️ The Solution</h2>
            <p>
                I fixed this by explicitly adding a route in the <strong>public subnet’s (NAT subnet) route table</strong>:
            </p>
            <pre><code>10.0.2.0/24 (private subnet CIDR) → Firewall Endpoint</code></pre>
            <p>
                This crucial step forced **return traffic from the NAT Gateway back to the private subnet to also go through the firewall**, thereby maintaining <strong>symmetric inspection</strong> and closing the routing loop.
            </p>
        </section>

        <hr>

        <section class="section">
            <h2>💡 Key Takeaway</h2>
            <p>
                When deploying AWS Network Firewall purely for egress filtering, <strong>symmetric routing is critical</strong>. Without it, your stateful rules will not function as intended — leading to either allowing traffic you expect to block or dropping sessions erratically due to incomplete session visibility. Always ensure both inbound and outbound traffic paths traverse your firewall.
            </p>
        </section>

    </div>
</body>
</html>
