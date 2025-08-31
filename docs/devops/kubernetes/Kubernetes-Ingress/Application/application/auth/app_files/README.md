# Notification service

- This microservice is used to configure and setup notification feature for url-shortner service.

## pre-requisite

- Before running the application, make sure to inititate following environment variable.

|Variable name|Format|description|
|-------------|------|-----------|
|MYSQL_SERVER_ENDPOINT|`127.0.0.1`|MySQL Server endpoint|
|MYSQL_SERVER_USERNAME|`root`|MySQL Server Username|
|MYSQL_SERVER_PASSWORD|`password`|MySQL Server User Password|
|MYSQL_SERVER_DATABASE|`urlshortener`|MySQL Server Database|

NOTE: These token is must for notify application to initiate.

## APIs

- The below information represents the different parts of each function.

|Function Type|API|Payload|Success Return|
|:-----------:|:-:|:------|------|
|Login API|`/api/v1/auth/login`|`{'username': 'user1', 'password': '123'}`|`{'username': 'user1', 'password': '123', 'email': 'xxxxx@gmail.com'}`|
|Check User API|`/api/v1/auth/user`|`{'username': 'user1'}`|`{'username': 'user1'}`|
|Register API|`/api/v1/auth/register`|`{ 'email': 'xxxxxx@gmail.com', 'username': 'user1', 'password': '123'}`|`{'email': 'xxxxx@gmail.com'}`|
