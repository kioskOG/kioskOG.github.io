# URL-Short service

- This microservice used as gateway

## pre-requisite

- Before running the application, make sure to inititate following environment variable.

|Variable name|Format|description|
|-------------|------|-----------|
|MYSQL_SERVER_ENDPOINT|`127.0.0.1`|MySQL server address|
|MYSQL_SERVER_USERNAME|`root`|MySQL server username|
|MYSQL_SERVER_PASSWORD|`password`|MySQL Server user password|
|MYSQL_SERVER_DATABASE|`urlshortener`|MySQL Server Database|
|MYSQL_SERVER_PORT|`3306`|MySQL Server Port|

`NOTE`: These token is must for urlshort application to initiate.

## APIs

The below information represents the different parts of each function.

|Function Type|API|Payload|Success Return|
|:-----------:|:-:|:------|------|
|Report data API|`/report`|`{'email': 'xxxxxxxx@gmail.com'}`|`{[{'id': 26, 'link': 'https://google.com', 'short_url': 'CpAaqB', 'visitors': 0, 'email': 'bhupi212@gmail.com'}], 200}`|
