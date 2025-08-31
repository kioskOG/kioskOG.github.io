<div align="center" style="background: linear-gradient(270deg, #00c6ff, #9c27b0, #ff0080);
    background-size: 600% 600%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientMove 8s ease infinite;">
  
  <h1>🌟 ShortURL Application 🌟</h1>
  
  <a href="https://github.com/kioskOG/Universal-Session-Structure">
    <img src="https://readme-typing-svg.demolab.com?font=italic&weight=700&size=18&duration=4000&pause=1000&color=FFD700&center=true&width=600&lines=+--+ShortURL+Application--" alt="Typing SVG" />
  </a>
</div>


## Overview

Python Url Shortner is a web application that provides URL shortening functionality along with user interface, authentication, reporting, and URL shortening services.

## Services

### UI Service

- **Description**: This service provides the user interface for the URL shortener application.
- **Path**: `/`
- **Kubernetes Service Name**: `flask-uiapp`
- **Port**: 5000

### AUTH Service

- **Description**: This service handles user authentication and interacts with the database for user information.
- **Paths**:
  - `/api/v1/auth/register`
  - `/api/v1/auth/login`
- **Kubernetes Service Name**: `flask-authapp`
- **Port**: 5000

### REPORT Service

- **Description**: This service generates reports showing URLs visited by users.
- **Path**: `/report`
- **Kubernetes Service Name**: `flask-reportapp`
- **Port**: 5000

### URL-SHORT Service

- **Description**: This service shortens long URLs and redirects users to the original URL.
- **Paths**:
  - `/api/url`
  - `/r/<short_url>` --> "<short_url>" this is a short url which can be used to visit the long url
  - `/allurls`
- **Kubernetes Service Name**: `flask-shorturlapp`
- **Port**: 5000

## Usage

To access the various services, use the appropriate paths mentioned above in combination with the base URL of your Kubernetes cluster.

For example:
- To access the UI Service: `http://<cluster-ip>/`
- To register a new user: `http://<cluster-ip>/api/v1/auth/register`
- To shorten a URL: `http://<cluster-ip>/api/url`

## Installation

1. Clone the repository.
2. Deploy the services to your Kubernetes cluster using the provided Kubernetes configuration files.

## Dependencies

- Python 3.x
- Flask
- Kubernetes

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

