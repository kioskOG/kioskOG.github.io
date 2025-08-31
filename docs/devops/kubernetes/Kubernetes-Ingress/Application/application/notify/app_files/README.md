# Notification service

- This microservice is used to configure and setup notification feature for url-shortner service.

## pre-requisite

- Before running the application, make sure to inititate following environment variable.

|Variable name|Format|description|
|-------------|------|-----------|
|SENDER_EMAIL|`xxxxxxxx@gmail.com`|Email which specify the sender|
|GMAIL_API_TOKEN|`{"token": "xxxxx", "refresh_token": "1//xxxxxx", "token_uri": "https://oauth2.googleapis.com/token", "client_id": "xxxxx.apps.googleusercontent.com", "client_secret": "xxxxxx", "scopes": ["https://www.googleapis.com/auth/gmail.send"], "universe_domain": "googleapis.com", "account": "", "expiry": "2024-04-22"}`|Permanent token generated from gmail Oauth Credentials|
|GOOGLE_API_SCOPE|`["https://www.googleapis.com/auth/gmail.send"]`|This scope is used to provide what Google API will execute|

NOTE: These token is must for notify application to initiate.

## APIs

- The below information represents the different parts of each function.

|Function Type|API|Payload|Success Return|
|:-----------:|:-:|:------|------|
|Register|`/api/v1/notify/register`|`{"Email": "xxxxxxxxxxx@gmail.com", "FirstName": "bhupender", "LastName": "singh"}`|`{"Email":"xxxxxxxxxxx@gmail.com","code":"200","msg":"Message has been successfully sent!"}`|
|Login|`/api/v1/notify/login`|`{"Email": "xxxxxxxxxxx@gmail.com", "FirstName": "bhupender", "LastName": "singh", "template": "welcomeMessage"}`|`{"Email":"xxxxxxxxxxx@gmail.com","code":"200","msg":"Message has been successfully sent!"}`|
|All URL|`/api/v1/notify/allurl`|`{"Email": "xxxxxxxxxxx@gmail.com", "FirstName": "bhupender", "LastName": "singh", "Data":[{"url":"https://youtube.com","visitors":20}]}`|`{"code":"200","msg":"Message has been successfully sent!"}`|
|Single URL|`/api/v1/notify/s/<shorturl>`|`{"Email": "xxxxxxxxxxx@gmail.com", "FirstName": "bhupender", "LastName": "singh", "Data":{"main_url":"https://youtube.com","short_url":"ABCDE", "visitors":20}}`|`{"code":"200","msg":"Message has been successfully sent!"}`|
