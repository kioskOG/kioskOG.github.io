---
title: Wazuh File Integrity Monitoring
layout: home
parent: Wazuh
grand_parent: Linux Projects
nav_order: 4
permalink: /docs/devops/Linux/SIEM-And-XDR/FIM/
description: Documentation for File Integrity Monitoring setup.
---

# What is File Integrity Monitoring (FIM)?

#### FIM is a security practice that monitors files and directories for unauthorized changes. By detecting modifications, additions, or deletions, FIM helps identify potential security breaches, configuration drifts, or accidental modifications.

## **Benefits of Wazuh FIM:**
* **Proactive Security:** Instantly identify unauthorized changes, potentially indicating security breaches.
* **Maintain System Consistency:** Ensure critical system files remain unaltered.
* **Enhanced Auditability:** Track file changes for comprehensive forensic analysis.

## Configuration Steps:

1) ## Edit ossec.conf

> Navigate to the Wazuh agent configuration file:

```shell
vi /var/ossec/etc/ossec.conf
```

2) ## Enable File Integrity Monitoring:

> * Locate the <syscheck> section and ensure disabled is set to **no**. This activates file integrity monitoring.

3) ## Configure Monitoring Frequency:

> * The <frequency> tag defines how often Wazuh scans for file changes. The default is `12 hours`. For this demo we are keeping it as `10 seconds`, but you can adjust it based on your needs and system load.


4) ## Initial Scan and New File Alerts:

> * Set scan_on_start to yes to trigger an initial scan upon agent startup.

> * Enable alert_new_files to receive alerts when new files appear in monitored directories.


5) ## Ignoring Frequent Changes:

> * Utilize auto_ignore to avoid overwhelming alerts for frequently modified files. Set frequency to the desired ignore timeframe (e.g., ignore files changing every 10 seconds within an hour).

6) ## Define Directories to Monitor:
> Within the <directories> tag, specify the critical directories you want Wazuh to monitor. Examples include:
  *    `/etc` - System configuration files
  *    `/usr/bin & /usr/sbin` - Essential system binaries
  *    `/tmp` - Temporary files (optional, depending on your security policy)


> Final code will look like below.
{: .note }

```shell
<!-- File integrity monitoring -->
<syscheck>
  <disabled>no</disabled>
<!-- Frequency that syscheck is executed default every 10 seconds -->
  <frequency>10</frequency>
  <scan_on_start>yes</scan_on_start>
  <!-- Generate alert when new file detected -->
  <alert_new_files>yes</alert_new_files>
  <!-- Don't ignore files that change more than 'frequency' times -->
  <auto_ignore frequency="10" timeframe="3600">no</auto_ignore>
  <!-- Directories to check  (perform all possible verifications) -->
  <directories>/etc,/usr/bin,/usr/sbin, /tmp</directories>
  <directories>/bin,/sbin,/boot</directories>
```

7) ## Restart Wazuh Agent:

After saving changes, restart the Wazuh agent using.
```shell
systemctl restart wazuh-agent
```


8) ## Verifying Monitoring:

> Access your Wazuh console and navigate to the file integrity monitoring events section.
> You should see events for monitored directories, including:

```plaintext
Add - New file detected
Modify - Existing file changed
Delete - File deleted
```


```markdown
{: .highlight }
Referance
```
[wazuh-for-file-integrity-monitoring](https://systemweakness.com/using-wazuh-for-file-integrity-monitoring-9d4a11501529)