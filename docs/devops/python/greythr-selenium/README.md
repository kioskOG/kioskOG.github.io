---
title: Greythr Attendance Automation
layout: home
parent: python
nav_order: 3
permalink: /docs/devops/python/greythr-selenium/README/
description: Greythr Attendance Automation
---

# Greythr Automated Sign-In/Sign-Out Script

This Python script automates the sign-in and sign-out process on a website using Selenium. It schedules the sign-in and sign-out tasks from Monday to Friday at random times within a specified range. Additionally, it captures screenshots and sends email notifications upon successful execution.

## Features
- ✅ Automated sign-in/sign-out using Selenium.
- ✅ Uses headless Chrome browser for automation.
- ✅ Sends email notifications for successful actions.
- ✅ Takes a screenshot of the process.
- ✅ Uses a scheduler to run tasks on weekdays.
- ✅ Secure credential management via YAML configuration.

---

## Installation & Setup

### Prerequisites
- **Python 3.x**
- **Google Chrome** (Ensure it's installed on the system)
- **Chrome WebDriver** (Automatically managed by `webdriver-manager`)
- **Ubuntu/Linux Server (for deployment)**

## Required Python Packages
Install the necessary dependencies using:

```bash
pip install -r requirements.txt
```

### `requirements.txt`

```bash
selenium
yaml
pyyaml
schedule
pytz
logging
webdriver-manager
random
datetime
smtplib
logging
os
```

Run the following command to install required Python packages:

```bash
pip3 install -r requirements.txt
```

### Configure Credentials

{: .note }
> Create a file named `h-input.yaml` in the same directory and add the following details:

```yaml
website_link: "<WEBSITE URL>"
username: "<YOUR USERNAME>"
password: "<YOUR PASSWORD>"
email_sender: "<YOUR EMAIL>"
email_password: "<YOUR EMAIL PASSWORD>" # Use Google App Passwords  https://myaccount.google.com/u/1/apppasswords
email_host: "smtp.gmail.com"
email_port: 587

email_recipients:
  - name: "Recipient One"
    email: "<RECIPIENT EMAIL>"
```

### Running the Script
Run the script using:
```bash
python3 main.py
```

### `main.py`

```py
import os
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import yaml
import time
from datetime import datetime, timedelta
from pytz import timezone
import schedule
import random

# IST Timezone setup
IST = timezone('Asia/Kolkata')
os.environ["DISPLAY"] = ":99"


def load_credentials(file_path):
    """Load credentials from a YAML file."""
    with open(file_path, 'r') as file:
        credentials = yaml.safe_load(file)
    return credentials


# Load credentials from YAML
credentials = load_credentials('h-input.yaml')
url = credentials["website_link"]
uname = credentials["username"]
password = credentials["password"]

# Email Credentials
sender_email = credentials["email_sender"]
password_email = credentials["email_password"]
recipient_emails = credentials["email_recipients"]
email_host = credentials["email_host"]
email_port = credentials["email_port"]


# Send email notification
def send_email_notification(action):
    try:
        logging.info("Connecting to SMTP server...")
        with smtplib.SMTP(host=email_host, port=email_port) as smtp_server:
            smtp_server.starttls()
            smtp_server.login(user=sender_email, password=password_email)

            for recipient in recipient_emails:
                message = MIMEMultipart('alternative')
                message['Subject'] = f"Greythr Attendance Notification: {action} Successful"
                message['To'] = recipient["email"]
                message['From'] = sender_email

                body = f"Your {action} has been successfully recorded at {datetime.now(IST).strftime('%Y-%m-%d %H:%M:%S')} IST."
                email_template = f"""
Greetings {recipient['name']},

{body}

Regards,
Automated Greythr Attendance System
"""
                mail_template = MIMEText(email_template, "plain")
                message.attach(mail_template)
                smtp_server.sendmail(to_addrs=recipient["email"], from_addr=sender_email, msg=message.as_string())
                logging.info(f"Email sent to {recipient['email']}")
    except Exception as e:
        logging.error(f"❌ Email notification failed: {e}")


def screenshot(driver):
    timestamp = datetime.now(IST).strftime('%Y-%m-%d_%H-%M-%S')
    filename = f"screenshot_Sign_In_{timestamp}.png"
    screenshot_path = os.path.join(os.getcwd(), filename)
    driver.save_screenshot(screenshot_path)

    print(f"Screenshot saved at {filename}")


def get_random_time(start_hour, start_minute, end_hour, end_minute):
    """Generate a random time within a given range."""
    now = datetime.now(IST)
    start_time = now.replace(hour=start_hour, minute=start_minute, second=0, microsecond=0)
    end_time = now.replace(hour=end_hour, minute=end_minute, second=0, microsecond=0)

    if start_time == end_time:
        return start_time.strftime('%H:%M')  # Avoid zero range issue

    random_minutes = random.randint(0, (end_time - start_time).seconds // 60)
    random_time = start_time + timedelta(minutes=random_minutes)
    return random_time.strftime('%H:%M')


def signin():
    """Automate login and sign-out process using Selenium."""
    service = Service(ChromeDriverManager().install())
    options = Options()
    # options.add_argument("--headless")  # Run without UI
    options.add_argument("--no-sandbox")  # Required for EC2
    options.add_argument("--disable-dev-shm-usage")  # Prevents memory issues
    options.add_argument("--disable-gpu")  # Prevents GPU-related issues
    options.add_argument("--remote-debugging-port=9222")  # Debugging support
    options.add_argument("--window-size=1920,1080")  # Set a proper window size
    options.add_argument("--disable-blink-features=AutomationControlled")  # Bypass detection
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get(url)

        # Wait for username field and enter data
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, "username"))
        ).send_keys(uname)
        driver.find_element(By.ID, "password").send_keys(password)

        # Click login button
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
        )
        driver.execute_script("arguments[0].click();", submit_button)
        print("✅ Successfully logged in.")

        time.sleep(5)  # Wait for UI update

        # **✅ FIXED:** Ensure the signout button exists before clicking
        signin_button_css = "gt-attendance-info .btn-container gt-button:nth-child(1)"

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, signin_button_css))
        )

        signin_script = f"""
        var button = document.querySelector('{signin_button_css}');
        if (button && button.shadowRoot) {{
            var btn = button.shadowRoot.querySelector('button');
            if (btn) btn.click();
            else console.error("Sign-in button inside Shadow DOM not found.");
        }} else {{
            console.error("Sign-in button not found.");
        }}
        """
        driver.execute_script(signin_script)
        print("✅ Sign-in button clicked.")

        time.sleep(5)

        # **✅ FIXED:** Ensure dropdown exists before interacting
        dropdown_css = "gt-popup-modal gt-dropdown"

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, dropdown_css))
        )

        select_dropdown_script = f"""
        var dropdown = document.querySelector('{dropdown_css}');
        if (dropdown && dropdown.shadowRoot) {{
            var img = dropdown.shadowRoot.querySelector('button img');
            if (img) img.click();
            else console.error("Dropdown button not found.");
        }} else {{
            console.error("Dropdown not found.");
        }}
        """
        driver.execute_script(select_dropdown_script)
        print("✅ Dropdown opened.")

        time.sleep(5)

        # **✅ FIXED:** Ensure Office Selection Exists Before Clicking
        office_selector_css = "gt-popup-modal gt-dropdown"

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, office_selector_css))
        )

        select_office_script = f"""
        var officeDropdown = document.querySelector('{office_selector_css}');
        if (officeDropdown && officeDropdown.shadowRoot) {{
            var office = officeDropdown.shadowRoot.querySelector('div.dropdown-margin div div div:nth-child(3)');
            if (office) office.click();
            else console.error("WFH selection option not found.");
        }} else {{
            console.error("WFH selection dropdown not found.");
        }}
        """
        driver.execute_script(select_office_script)
        print("✅ Work From Home selected in DropDown.")

        time.sleep(5)

        # **✅ FINAL SIGN-OUT CONFIRMATION**
        final_signin_script = """
        var finalSignOutButton = document.querySelector('body app ng-component div div div.container-fluid.app-container.px-0 div ghr-home div.page.page-home.ng-star-inserted div gt-home-dashboard gt-popup-modal div div div.flex-1 gt-button');
        if (finalSignOutButton && finalSignOutButton.shadowRoot) {
            var btn = finalSignOutButton.shadowRoot.querySelector('button');
            if (btn) btn.click();
            else console.error("Final sign-in button inside Shadow DOM not found.");
        } else {
            console.error("Final sign-in button not found.");
        }
        """
        driver.execute_script(final_signin_script)
        print(f"✅ Sign-in successfully executed at {datetime.now(IST).strftime('%Y-%m-%d %H:%M:%S')} IST")
        send_email_notification("Sign-in")
        print(f"Email Sent to {recipient_emails}")

        time.sleep(5)

        screenshot(driver)

        time.sleep(5)

    except Exception as e:
        print(f"❌ Error during execution: {e}")

    finally:
        driver.quit()


def signout():
    """Automate login and sign-out process using Selenium."""
    service = Service(ChromeDriverManager().install())
    options = Options()
    # options.add_argument("--headless")  # Run without UI
    options.add_argument("--no-sandbox")  # Required for EC2
    options.add_argument("--disable-dev-shm-usage")  # Prevents memory issues
    options.add_argument("--disable-gpu")  # Prevents GPU-related issues
    options.add_argument("--remote-debugging-port=9222")  # Debugging support
    options.add_argument("--window-size=1920,1080")  # Set a proper window size
    options.add_argument("--disable-blink-features=AutomationControlled")  # Bypass detection
    # options.add_argument("--headless")
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get(url)

        # Wait for username field and enter data
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, "username"))
        ).send_keys(uname)
        driver.find_element(By.ID, "password").send_keys(password)

        # Click login button
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
        )
        driver.execute_script("arguments[0].click();", submit_button)
        print("✅ Successfully logged in.")

        time.sleep(5)  # Wait for UI update

        # **✅ FIXED:** Ensure the signout button exists before clicking
        signout_button_css = "gt-attendance-info .btn-container gt-button:nth-child(1)"

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, signout_button_css))
        )

        signout_script = f"""
        var button = document.querySelector('{signout_button_css}');
        if (button && button.shadowRoot) {{
            var btn = button.shadowRoot.querySelector('button');
            if (btn) btn.click();
            else console.error("Sign-out button inside Shadow DOM not found.");
        }} else {{
            console.error("Sign-out button not found.");
        }}
        """
        driver.execute_script(signout_script)
        print("✅ Sign-out button clicked.")

        time.sleep(5)

        # **✅ FIXED:** Ensure dropdown exists before interacting
        dropdown_css = "gt-popup-modal gt-dropdown"

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, dropdown_css))
        )

        select_dropdown_script = f"""
        var dropdown = document.querySelector('{dropdown_css}');
        if (dropdown && dropdown.shadowRoot) {{
            var img = dropdown.shadowRoot.querySelector('button img');
            if (img) img.click();
            else console.error("Dropdown button not found.");
        }} else {{
            console.error("Dropdown not found.");
        }}
        """
        driver.execute_script(select_dropdown_script)
        print("✅ Dropdown opened.")

        time.sleep(5)

        # **✅ FIXED:** Ensure Office Selection Exists Before Clicking
        office_selector_css = "gt-popup-modal gt-dropdown"

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, office_selector_css))
        )

        select_office_script = f"""
        var officeDropdown = document.querySelector('{office_selector_css}');
        if (officeDropdown && officeDropdown.shadowRoot) {{
            var office = officeDropdown.shadowRoot.querySelector('div.dropdown-margin div div div:nth-child(3)');
            if (office) office.click();
            else console.error("WFH selection option not found.");
        }} else {{
            console.error("WFH selection dropdown not found.");
        }}
        """
        driver.execute_script(select_office_script)
        print("✅ Work From Home selected in DropDown.")

        time.sleep(5)

        # **✅ FINAL SIGN-OUT CONFIRMATION**
        final_signout_script = """
        var finalSignOutButton = document.querySelector('body app ng-component div div div.container-fluid.app-container.px-0 div ghr-home div.page.page-home.ng-star-inserted div gt-home-dashboard gt-popup-modal div div div.flex-1 gt-button');
        if (finalSignOutButton && finalSignOutButton.shadowRoot) {
            var btn = finalSignOutButton.shadowRoot.querySelector('button');
            if (btn) btn.click();
            else console.error("Final sign-out button inside Shadow DOM not found.");
        } else {
            console.error("Final sign-out button not found.");
        }
        """
        driver.execute_script(final_signout_script)
        print(f"✅ Sign-out successfully executed at {datetime.now(IST).strftime('%Y-%m-%d %H:%M:%S')} IST")

        time.sleep(5)

        screenshot(driver)
        send_email_notification("Sign-out")

        time.sleep(5)

    except Exception as e:
        print(f"❌ Error during execution: {e}")

    finally:
        driver.quit()


# Schedule tasks from Monday to Friday
for day in ["monday", "tuesday", "wednesday", "thursday", "friday"]:
    sign_in_time = get_random_time(9, 46, 9, 47)
    sign_out_time = get_random_time(19, 16, 19, 17)

    print(f"📅 Scheduled sign-in at {sign_in_time} and sign-out at {sign_out_time} on {day.capitalize()}")

    getattr(schedule.every(), day).at(sign_in_time).do(signin)
    getattr(schedule.every(), day).at(sign_out_time).do(signout)


def run_scheduler():
    print(f"Scheduler started at {datetime.now(IST).strftime('%Y-%m-%d %H:%M:%S')} IST")
    while True:
        scheduled_jobs = schedule.get_jobs()
        # print(f"Pending Jobs: {[job.next_run for job in scheduled_jobs]}")
        schedule.run_pending()
        time.sleep(10)


if __name__ == "__main__":
    run_scheduler()
```

{: .important}
> The script will schedule sign-in and sign-out actions from Monday to Friday at random times.
> update `sign_in_time` & `sign_out_time` as per your need.

---
## How It Works
1. **Loads Credentials:** Reads credentials from `h-input.yaml`.
2. **Connects to Website:** Uses Selenium to log in.
3. **Executes Sign-In/Sign-Out:** Clicks appropriate buttons on the website.
4. **Captures Screenshot:** Saves a screenshot for verification.
5. **Sends Email Notifications:** Notifies users of successful execution.
6. **Schedules Tasks:** Runs tasks at randomized times within a given range.

---

## Debugging & Logs
If the script encounters errors:
- Check the console logs for error messages.
- Ensure ChromeDriver is installed and accessible.
- Validate `h-input.yaml` for correct credentials.
- Try running the script with UI by removing `--headless` from `webdriver` options.

---

2. ## Deploying as a Systemd Service (For Ubuntu Server)

## Set the timezone to Asia/Kolkata

---
```bash
timedatectl list-timezones
timedatectl set-timezone Asia/Kolkata
timedatectl
```

---

## Install Chrome Driver

{: .note }
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

{: .warning }
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

{: .note}
> /var/log/attendance.log
