## Set the timezone to Asia/Kolkata
---
```bash
timedatectl list-timezones
timedatectl set-timezone Asia/Kolkata
timedatectl
```
---

## Install Chrome Driver

> [!NOTE]
> [chrome-driver-portal](https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json)

```bash
wget https://storage.googleapis.com/chrome-for-testing-public/133.0.6943.53/linux64/chromedriver-linux64.zip
unzip chromedriver-linux64.zip
cd chromedriver-linux64/
sudo mv chromedriver /usr/local/bin/
sudo chmod +x /usr/local/bin/chromedriver
chromedriver --version
```
---

## Install python3 & dependencies

```bash
apt install -y python3 python3-pip python3-venv unzip wget
python3 -m venv myenv
source myenv/bin/activate
```

## Install pip modules

```bash
pip install schedule yaml datetime pytz random --break-system-packages
pip3 install selenium webdriver-manager pyyaml schedule pytz --break-system-packages
```
> [!WARNING]
> use python virtual env if you want to use --break-system-packages.
> As ubuntu is a secure system, it won't allow to use without virtual env.

## Import display
```bash
sudo apt install -y xvfb
Xvfb :99 -screen 0 1920x1080x16 & export DISPLAY=:99
```
---
## Systemd Service

```bash
# /etc/systemd/system/attendance.service
[Unit]
Description=Automated Attendance System
After=network.target

[Service]
ExecStart=/usr/bin/python3 /root/myenv/attendance.py
WorkingDirectory=/root/myenv
Restart=always
User=root
Environment="DISPLAY=:99"
StandardOutput=append:/var/log/attendance.log
StandardError=append:/var/log/attendance.log

[Install]
WantedBy=multi-user.target
```

```bash
vim /etc/systemd/system/attendance.service
systemctl daemon-reload
sudo systemctl enable attendance.service
sudo systemctl start  attendance.service
systemctl status attendance.service
journalctl -u attendance.service -f
journalctl -u attendance.service -f --no-pager -n 50
```
---
## log directory
>> /var/log/attendance.log