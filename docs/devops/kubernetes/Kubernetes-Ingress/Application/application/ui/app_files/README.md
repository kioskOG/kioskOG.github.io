# URL-Short service

- This microservice used as gateway

## pre-requisite

- Before running the application, make sure to inititate following environment variable.

|Variable name|Format|description|
|-------------|------|-----------|
|SHORTURL_GENERATED_URL|`domainname.com`|Short-URL Server generated URL which will used to redirect Short URLs|
|SESSION_SECRET_KEY|`1a2b3c4d5e6d7g8h9i10`|This secret key used to decrypt session tokens|
|AUTH_SERVER_URL|`http://flask-authapp:5000`|Authentication API Server URL|
|AUTH_SERVER_LOGIN_API|`/api/v1/auth/login`|Authentication Server Login API|
|AUTH_SERVER_USER_API|`/api/v1/auth/user`|Authentication Server User Login API|
|AUTH_SERVER_REGISTER_API|`/api/v1/auth/register`|Authentication Server User Register API|
|NOTIFY_SERVER_URL|`http://flask-notifyapp:5000`|Notification API Server URL|
|NOTIFY_USER_REGISTER_API|`/api/v1/notify/register`|Notification API User Register email API|
|NOTIFY_USER_LOGIN_API|`/api/v1/notify/login`|Notification API User login emai lAPI|
|NOTIFY_USER_ALLURLS_API|`/api/v1/notify/allurl`|Notification API to get ALL URL Details|
|NOTIFY_USER_SHORTURLS_API|`/api/v1/notify/s/<shorturl>`|Notification API to get specific URL Detail|
|SHORTURL_SERVER_URL|`http://flask-shorturlapp:5000`|ShortURL API server endpoint|
|SHORTURL_SERVER_URL_API|`/api/url`|ShortURL Server API to specify Short URL Details|
|REPORT_SERVER_URL|`http://flask-reportapp:5000`|Report Server API Endpoint|
|REPORT_SERVER_REPORT_API|`/report`|Report Server API to get user URLs report|
|UI_SERVER_PORT|`5000`|Report Server API to get user URLs report|

`NOTE`: These token is must for urlshort application to initiate.

## APIs

The below information represents the different parts of each function.

|Function Type|API|Payload|Success Return|
|:-----------:|:-:|:------|------|
|Generate URL|`/api/url`|`{"users_email": "xxxxxxxxxxx@gmail.com", "long_url": "https://google.com/"}`|`{"long_url": "https://google.com/","short_url": "https://<SHORTURL>/r/fnRr2D"}`|
|Login|`/r/<short_url>`|-|`Redirect to URL`|
