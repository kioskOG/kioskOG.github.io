---
title: Contact Me
layout: home
parent: About Me
nav_order: 1
permalink: /docs/about/contact/
---

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Contact Me | Jatin Sharma</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <style>
    /* Root variables for theming - Aligned with About Me page's orange palette */
    :root {
        --primary-color: #ffb347; /* Orange/Yellow accent from About Me template */
        --light-primary-shade: #ffd97d; /* Lighter shade of primary-color for gradients */
        --bg-dark: #1e1f26; /* Dark background from About Me template */
        --text-dark: #e0e0e0; /* Light text for dark mode from About Me template */
        --card-bg-dark: rgba(25, 25, 34, 0.7); /* Base card background from Contact Me template */
        --section-bg-dark: rgba(25, 25, 34, 0.6); /* Section background from Contact Me template */
        --form-bg-dark: rgba(13, 13, 16, 0.7); /* Form background from Contact Me template */
        
        /* Retaining original Contact Me accents for subtle elements if needed,
           but primary elements will use the orange palette. */
        --contact-secondary-purple: #9c27b0; 
        --contact-tertiary-pink: #ff0080;
    }

    /* Base Body Styling */
    body {
      background-color: #070708; /* Dark background for contrast */
      color: var(--text-dark); /* Using root text-dark for consistency */
      font-family: 'Inter', Arial, sans-serif;
      margin: 0;
      padding: 0;
      text-align: center;
      line-height: 1.6;
      min-height: 100vh; 
      background-image: radial-gradient(circle at top left, #2f0a5d 0%, transparent 50%),
                        radial-gradient(circle at bottom right, #004d40 0%, transparent 50%); /* Subtle background gradients */
      background-blend-mode: screen;
    }

    /* HEADER GRADIENT - Now uses the orange gradient from About Me page */
    .gradient-header {
      background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color));
      background-size: 600% 600%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 8s ease infinite;
      margin-top: 40px;
      margin-bottom: 10px;
    }
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* Animated gradient text style for main headings - Now uses the orange gradient */
    .welcome-gradient {
      background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color));
      background-size: 600% 600%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 8s ease infinite;
      margin-bottom: 0.5em;
      font-size: 2.7em;
      font-weight: bold;
      text-align: center;
      text-shadow: 0 0 10px rgba(0, 198, 255, 0.3); /* Keeping subtle blue shadow for depth */
    }

    /* Main Content Container - Glass Effect */
    .container {
      max-width: 900px;
      margin: 40px auto; 
      padding: 40px 20px;
      border-radius: 15px;
      background-color: var(--card-bg-dark); 
      backdrop-filter: blur(15px) saturate(180%);
      -webkit-backdrop-filter: blur(15px) saturate(180%);
      border: 1px solid rgba(var(--contact-secondary-purple), 0.3); 
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }
    .container:hover {
      box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.45); 
    }

    /* Paragraph Styling */
    p {
      font-size: 1.1em;
      line-height: 1.7;
      margin-bottom: 1.2em;
      color: var(--text-dark);
    }

    /* Social Icons - Reused from Home page, adapted for badges */
    .social-badges {
      margin-top: 25px;
      margin-bottom: 35px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    .social-badges a {
      display: inline-block;
      vertical-align: middle;
      border-radius: 5px;
      transition: transform 0.2s ease-in-out;
    }
    .social-badges a:hover {
        transform: translateY(-3px);
    }
    .social-badges img {
        border-radius: 5px;
    }

    /* Section Styling (for Collaboration, Message form) - Glass Effect */
    .section {
      background-color: var(--section-bg-dark); 
      backdrop-filter: blur(10px) saturate(150%);
      -webkit-backdrop-filter: blur(10px) saturate(150%);
      padding: 30px;
      border-radius: 12px;
      margin-top: 40px;
      border: 1px solid rgba(var(--contact-secondary-purple), 0.2); 
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.25);
      text-align: left;
      max-width: 850px;
      margin-left: auto;
      margin-right: auto;
    }
    .section h2 {
      color: var(--primary-color); /* Updated to use primary orange */
      margin-bottom: 25px;
      text-align: center;
      font-size: 2.2em;
      letter-spacing: 2px;
      text-shadow: 0 0 8px rgba(var(--primary-color), 0.2);
    }

    /* Form Styling - Glass Effect for inputs */
    form {
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin-top: 25px;
      padding: 25px;
      background-color: var(--form-bg-dark); 
      border-radius: 10px;
      border: 1px solid rgba(var(--primary-color), 0.2); /* Updated border to orange */
      box-shadow: 0 2px 7px rgba(0, 0, 0, 0.35);
    }

    form label {
      font-size: 1.15em;
      font-weight: bold;
      color: var(--primary-color); /* Updated label color to orange */
      margin-bottom: 5px;
      text-align: left;
    }

    form input[type="text"],
    form input[type="email"],
    form textarea {
      padding: 14px;
      border: 1px solid rgba(var(--primary-color), 0.4); /* Updated border to orange */
      border-radius: 8px;
      background-color: rgba(42, 42, 53, 0.8);
      color: var(--text-dark);
      font-size: 1em;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    }

    form input[type="text"]:focus,
    form input[type="email"]:focus,
    form textarea:focus {
      outline: none;
      border-color: var(--primary-color); /* Updated focus border to orange */
      box-shadow: 0 0 12px rgba(var(--primary-color), 0.7); /* Updated focus shadow to orange */
      background-color: rgba(51, 51, 64, 0.9);
    }

    form textarea {
      resize: vertical;
      min-height: 120px;
    }

    /* Button with pulse - Same styling as About Me page's .btn */
    .btn {
        display: inline-flex;
        align-items: center;
        background: linear-gradient(90deg, var(--light-primary-shade) 0%, var(--primary-color) 50%, var(--light-primary-shade) 100%);
        color: #1d2329;
        padding: 13px 34px;
        border-radius: 30px;
        text-decoration: none;
        font-size: 20px;
        font-weight: 600;
        box-shadow: 0 2px 18px rgba(var(--light-primary-shade), 0.6);
        border: none;
        outline: none;
        transition: background 0.24s, color 0.15s, box-shadow 0.21s, transform 0.2s ease-in-out;
        animation: pulse 2s infinite;
        margin: 10px; /* Added margin for spacing if multiple buttons */
    }
    .btn i {
        margin-left: 9px;
        font-size: 1.16em;
    }
    .btn:hover, .btn:focus {
        background: linear-gradient(90deg, var(--primary-color) 0%, var(--light-primary-shade) 60%, var(--primary-color) 100%);
        color: #23272f;
        box-shadow: 0 4px 24px rgba(var(--primary-color), 0.56);
        transform: translateY(-2px);
    }

    /* The submit button will now use the .btn styling */
    form button[type="submit"] {
        /* Reset any conflicting form button styles */
        all: unset; /* Remove all default button styles */
        cursor: pointer; /* Ensure cursor remains pointer */
        text-align: center; /* Center text if needed */
        
        /* Apply .btn styles */
        display: inline-flex;
        align-items: center;
        justify-content: center; /* Center content within the button */
        background: linear-gradient(90deg, var(--light-primary-shade) 0%, var(--primary-color) 50%, var(--light-primary-shade) 100%);
        color: #1d2329;
        padding: 13px 34px;
        border-radius: 30px;
        text-decoration: none;
        font-size: 20px;
        font-weight: 600;
        box-shadow: 0 2px 18px rgba(var(--light-primary-shade), 0.6);
        border: none;
        outline: none;
        transition: background 0.24s, color 0.15s, box-shadow 0.21s, transform 0.2s ease-in-out;
        animation: pulse 2s infinite;
        align-self: center;
        max-width: 280px; /* Increased max-width for better appearance */
        letter-spacing: 0.5px;
    }
    form button[type="submit"]:hover {
        background: linear-gradient(90deg, var(--primary-color) 0%, var(--light-primary-shade) 60%, var(--primary-color) 100%);
        color: #23272f;
        box-shadow: 0 4px 24px rgba(var(--primary-color), 0.56);
        transform: translateY(-2px);
    }


    /* Horizontal Rule for separation - Uses primary orange */
    hr {
      border: none;
      border-top: 1px solid rgba(var(--primary-color), 0.5); 
      margin-top: 40px;
      margin-bottom: 20px;
    }

    /* Footer link styling - Now uses .btn styling */
    .footer-link-wrapper {
        display: block; /* To ensure the button takes its own line */
        text-align: center; /* Center the button */
        margin-top: 40px;
    }
    .footer-link {
        /* This will be handled by the .btn class */
        all: unset; /* Reset default anchor styles */
        cursor: pointer;
    }

    /* Animations */
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 108, 71, 0.5); }
        70% { box-shadow: 0 0 0 15px rgba(255,179,71,0); }
        100% { box-shadow: 0 0 0 0 rgba(255,179,71,0); }
    }
    @keyframes glow {
        0%, 100% { box-shadow: 0 2px 18px rgba(var(--primary-color), 0.2); }
        50% { box-shadow: 0 4px 28px rgba(var(--primary-color), 0.45); }
    }
    @keyframes floatBg {
    from { transform: translate(0,0); }
    to { transform: translate(8px, -8px); }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .welcome-gradient {
        font-size: 2em;
      }
      .section h2 {
        font-size: 1.8em;
      }
      p {
        font-size: 1em;
      }
      .btn { /* Applied to form submit and footer link */
        padding: 12px 25px;
        font-size: 1em;
        max-width: 180px;
      }
      .social-badges {
          gap: 10px;
      }
      .container {
          margin: 20px 10px;
          padding: 30px 15px;
      }
      .section {
          padding: 20px;
      }
      form {
          padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="gradient-header" align="center">
      <h1 class="welcome-gradient">✉️ Get in Touch ✉️</h1>
    </div>

    <p>
      I’d love to hear from you! Whether you have a question, want to collaborate, or just want to say hi, feel free to reach out.
    </p>

    <!-- Contact Details Section -->
    <section class="section">
      <h2>Contact Details</h2>
      <div class="social-badges">
        <a href="mailto:jatinvashishtha110@gmail.com" title="Gmail">
          <img
            src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"
            alt="Gmail"
          />
        </a>
        <a href="https://www.linkedin.com/in/jatin-devops/" target="_blank" rel="noopener" title="LinkedIn">
          <img
            src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"
            alt="LinkedIn"
          />
        </a>
        <a href="https://github.com/kioskog" target="_blank" rel="noopener" title="GitHub">
          <img
            src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"
            alt="GitHub"
          />
        </a>
      </div>
    </section>

    <!-- Collaboration Section -->
    <section class="section">
      <h2>Looking to Collaborate?</h2>
      <p>
        If you’re working on an exciting project or need help with DevOps, cloud architecture, or automation, I’d be happy to explore opportunities to collaborate.
      </p>
    </section>

    <!-- Quick Message Form Section -->
    <section class="section">
      <h2>Quick Message</h2>
      <p>
        Alternatively, you can use the form below to drop me a quick message. I'll get back to you as soon as possible.
      </p>
      <form action="https://formspree.io/f/xldekddk" method="POST">
        <!-- IMPORTANT: Replace YOUR_FORMSPREE_ID with your actual Formspree form ID -->
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label for="email">Email:</label>
        <input type="email" id="email" name="_replyto" required />

        <label for="message">Message:</label>
        <textarea id="message" name="message" rows="5" required></textarea>

        <button type="submit">Send Message</button>
      </form>
    </section>

    <hr>

    <!-- Footer Link -->
    <p class="footer-link-wrapper">
      Looking for my work? 
      <a href="/docs/devops/" class="btn">DevOps Projects <i class="fas fa-project-diagram"></i></a>
    </p>

  </div>
</body>
</html>
