---
title: Home
layout: home
nav_order: 1
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home | Jatin Sharma</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        .container {
            max-width: 900px;
            margin: auto;
            padding: 40px 20px;
        }
        .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #4caf50;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 2.5em;
            color: #4caf50;
        }
        p {
            font-size: 1.2em;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px;
            font-size: 1em;
            color: #fff;
            background-color: #4caf50;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            transition: 0.3s;
        }
        .btn:hover {
            background-color: #388e3c;
        }
        .social-icons a {
            margin: 10px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="./profile-image.png" alt="Jatin Sharma" class="profile-img">  <!-- Replace with your image -->
        <h1>Welcome to My Digital Space</h1>
        <p>Hello! I'm <strong>Jatin Sharma</strong>, a passionate DevOps Engineer dedicated to building scalable, automated cloud solutions.</p>
        <p>Explore my work, read insights, and connect with me to discuss technology and innovation.</p>
        
        <a href="/docs/about/" class="btn">About Me</a>
        <!-- <a href="portfolio.html" class="btn">My Portfolio</a> -->
        <a href="/docs/about/contact/" class="btn">Get in Touch</a>
        
        <div class="social-icons">
            <a href="mailto:jatinvashishtha110@gmail.com"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail"></a>
            <a href="https://www.linkedin.com/in/jatin-devops/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
            <a href="https://github.com/kioskog"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
        </div>
    </div>
</body>
</html>
