---
layout: post
title:  "Welcome to Jatin portfolio!"
date:   2024-12-07 13:31:09 +0530
categories: portfolio update
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jatin Sharma | DevOps Portfolio</title>
  <link rel="stylesheet" href="/src/css/custom.css">
  <style>
    /* Custom CSS to improve the layout */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    header {
      background-color: #333;
      color: white;
      padding: 1rem;
      text-align: center;
    }
    header h1 {
      margin: 0;
      font-size: 2.5rem;
    }
    header p {
      font-size: 1.2rem;
      margin-top: 0.5rem;
    }
    nav ul {
      list-style-type: none;
      padding: 0;
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    nav ul li {
      display: inline;
    }
    nav ul li a {
      color: rgb(202, 162, 31);
      text-decoration: none;
      font-weight: bold;
    }
    nav ul li a:hover {
      color: #c7ae21;
    }
    .container {
      display: flex;
      justify-content: space-between;
      margin: 2rem;
      flex-wrap: wrap; /* Allows content to wrap on smaller screens */
    }
    .sidebar {
      width: 18%; /* Reduced width for the sidebar */
      background-color: #f4f4f4;
      padding: 1rem;
      min-width: 250px; /* Ensures minimum width for sidebar */
    }
    .content {
      width: 75%; /* Adjusted content width */
      padding-left: 2rem;
    }
    .post-list {
      list-style-type: none;
      padding: 0;
    }
    .post-list li {
      margin: 1rem 0;
    }
    .post-link {
      text-decoration: none;
      color: #333;
      font-size: 1.5rem;
    }
    .post-link:hover {
      color: #cbaa24;
    }
    .rss-subscribe {
      font-size: 1.2rem;
      text-align: center;
      margin-top: 2rem;
    }
    #theme-toggle {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 1.5rem;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <header>
    <h1>Jatin Sharma</h1>
    <p>DevOps Engineer | Cloud Solutions | Infrastructure Automation</p>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/docs/devops/">DevOps Projects</a></li>
        <li><a href="/about/">About</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <!-- Dark Mode Toggle Button -->
  <button id="theme-toggle">🌙</button>

  <script>
    const toggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
  
    if (currentTheme) {
      document.body.setAttribute('data-theme', currentTheme);
    }
  
    toggleButton.addEventListener('click', () => {
      let newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  </script>

  <div class="container">
    <aside class="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li><a href="/docs/devops/docker/">Docker Projects</a></li>
        <li><a href="/docs/devops/aws/">AWS Integration</a></li>
        <li><a href="/docs/devops/ci-cd/">CI/CD Pipelines</a></li>
        <li><a href="/docs/devops/monitoring/">Monitoring & Alerts</a></li>
      </ul>
    </aside>

    <main class="content">
      <div class="home">
        <h2 class="post-list-heading">DevOps Portfolio</h2>
        <ul class="post-list">
          <li>
            <span class="post-meta">Nov 24, 2024</span>
            <h3><a class="post-link" href="/docs/devops/docker/Netbird/">Netbird VPN Server</a></h3>
            <p>A detailed guide on setting up Netbird VPN Server with Docker and Caddy for reverse proxy.</p>
          </li>
          <li>
            <span class="post-meta">Dec 7, 2024</span>
            <h3><a class="post-link" href="/docs/devops/docker/traefik/">Traefik Setup with Docker and Nginx</a></h3>
            <p>A detailed guide on setting up Traefik with Docker and Nginx for reverse proxy and load balancing.</p>
          </li>
        <p class="rss-subscribe">Subscribe <a href="/feed.xml">via RSS</a></p>
      </div>
    </main>
  </div>

  <script src="/src/js/dark-mode.js"></script>
</body>
</html>


`YEAR-MONTH-DAY-title.MARKUP`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.


{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Jatin')
#=> prints 'Hi, Jatin' to STDOUT.
{% endhighlight %}
