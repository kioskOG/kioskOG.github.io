# URL-Short service

- This microservice is used to create short URL for URLs and stored it in:
  - Redis
  - MySQL
- This microservice is also used to redirect short URL to Main URL.
- This microservice is also used to store visitors count.

## pre-requisite

- Before running the application, make sure to inititate following environment variable.

|Variable name|Format|description|
|-------------|------|-----------|
|MYSQL_SERVER_ENDPOINT|`127.0.0.1`|MySQL Server Address |
|MYSQL_SERVER_USERNAME|`root`|MySQL Server User for Auth |
|MYSQL_SERVER_PASSWORD|`password`|MySQL Server Password for Auth|
|MYSQL_SERVER_DATABASE|`urlshortdb`|MySQL Server Database where data will store|
|MYSQL_SERVER_PORT|`3306`|MySQL Server Port|
|MYSQL_SERVER_CHARSET|`utf8mb4`|MySQL Server charset|
|REDIS_SERVER_ENDPOINT|`127.0.0.1`|Redis Server Address|
|REDIS_SERVER_CHARSET|`utf-8`|Redis Server Charset|
|REDIS_SERVER_SHORTURL_TIMEOUT|`1800`|Redis Server Data Timeout|
|URLSHORT_SERVER_PORT|`5000`|ShortURL API Server Port|

`NOTE`: These token is must for urlshort application to initiate.

## APIs

The below information represents the different parts of each function.

|Function Type|API|Payload|Success Return|
|:-----------:|:-:|:------|------|
|Generate URL|`/api/url`|`{"users_email": "xxxxxxxxxxx@gmail.com", "long_url": "https://google.com/"}`|`{"long_url": "https://google.com/","short_url": "https://<SHORTURL>/r/fnRr2D"}`|
|Login|`/r/<short_url>`|-|`Redirect to URL`|
