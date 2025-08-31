import os
import json.decoder
import json
import google.auth.exceptions
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

sender_email = os.environ['SENDER_EMAIL']
gmail_api_token = json.loads(os.environ['GMAIL_API_TOKEN'])
# google_api_scope = os.environ['GOOGLE_API_SCOPE']
google_api_scope = json.loads(os.environ['GOOGLE_API_SCOPE'])

def emailNotification(emailSubject,recipientEmail,emailBody):
  creds = None
  try:
    creds = Credentials.from_authorized_user_info(gmail_api_token, google_api_scope)
  except json.decoder.JSONDecodeError:
    return {
    "msg": "Wrong JSON Format",
    "code": "500"
  }
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      try:
        creds.refresh(Request())
      except google.auth.exceptions.RefreshError:
        return {
          "msg": "Invalid refresh token",
          "code": "500"
        }
    else:
      return {
        "msg": "Wrong credentials",
        "code": "500"
      }
  else:
    return {
      "msg": "Token file not present",
      "code": "500"
    }

  try:
    service = build(
      "gmail",
      "v1",
      credentials=creds
      )
    message = MIMEMultipart('alternative')
    message["To"] = recipientEmail
    message["From"] = sender_email
    message["Subject"] = emailSubject
    message_attachment = MIMEText(emailBody, 'html')
    message.attach(message_attachment)

    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

    create_message = {
      "raw": encoded_message
      }
    send_message = (
        service.users()
        .messages()
        .send(userId="me", body=create_message)
        .execute()
    )
    return {
      "msg": "Message has been successfully sent!",
      "code": "200"
    }
  except HttpError as error:
    return {
      "msg": "Internal server error!",
      "code": "500"
    }
