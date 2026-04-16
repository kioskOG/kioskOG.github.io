import os
import glob
import re
from bs4 import BeautifulSoup
from markdownify import markdownify as md

def process_file(filepath):
    print(f"Processing: {filepath}")
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract frontmatter
    split_content = content.split('---')
    if len(split_content) >= 3:
        frontmatter = '---' + split_content[1] + '---'
        rest_content = '---'.join(split_content[2:])
        
        # Parse HTML part safely
        soup = BeautifulSoup(rest_content, 'html.parser')
        
        # If there's no body, just convert the whole rest_content
        target = soup.body if soup.body else soup
        
        # Clean up unnecessary wrappers if they exit like <main class="wrap">, <div class="container">
        # wait, markdownify will just handle them, but sometimes gives extra spaces.
        
        html_str = target.encode_contents().decode('utf-8') if soup.body else str(target)
        
        # Convert to markdown
        md_content = md(html_str, heading_style="ATX", strip=['style', 'script'])
        
        # Some quick cleanups
        md_content = re.sub(r'\n\s*\n\s*\n', '\n\n', md_content)
        
        new_content = frontmatter + '\n\n' + md_content.strip() + '\n'
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Success for {filepath}")

files = [
    "/Users/opstree/Documents/github.io/kioskOG.github.io/docs/devops/Networking/How-NAT-Saved-the-Internet.md",
    "/Users/opstree/Documents/github.io/kioskOG.github.io/docs/devops/Cloud/AWS/aws-firewall.md",
    "/Users/opstree/Documents/github.io/kioskOG.github.io/docs/devops/kubernetes/eks-logs-into-cloudwatch-using-fluentbit/eks-logs-into-cloudwatch-using-fluentbit.md",
    "/Users/opstree/Documents/github.io/kioskOG.github.io/docs/devops/kubernetes/AWS-Load-Balancer-Controller-Setup-for-EKS/AWS-Load-Balancer-Controller-Setup-for-EKS.md",
    "/Users/opstree/Documents/github.io/kioskOG.github.io/docs/devops/kubernetes/Kubernetes-Ingress/Routing-in-NGINX-Ingress-Controller.md",
    "/Users/opstree/Documents/github.io/kioskOG.github.io/docs/devops/kubernetes/Kubernetes-Ingress/Basic-Authentication-using-NGINX-Ingress.md",
    "/Users/opstree/Documents/github.io/kioskOG.github.io/docs/devops/kubernetes/Kubernetes-Ingress/Installing-NGINX-Ingress.md",
    "/Users/opstree/Documents/github.io/kioskOG.github.io/docs/devops/kubernetes/Kubernetes-Ingress/secure-your-app-with-https-using-self-signed-tls-certificates.md",
    "/Users/opstree/Documents/github.io/kioskOG.github.io/docs/devops/kubernetes/Kubernetes-Ingress/Understanding-Ingress-Controllers.md"
]

for f in files:
    if os.path.exists(f):
        process_file(f)
