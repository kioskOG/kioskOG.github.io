---
layout: full-bleed-glass
title: Contact Me | Jatin Sharma
parent: About Me
nav_order: 1
permalink: /docs/about/contact/
preload_image: /assets/images/profile-image.png
profile_image: /assets/images/profile-image.png
profile_alt: Jatin Sharma
hero_title: "👋 About Jatin Sharma 👋"
hero_title: "✉️ Get in Touch ✉️"
hero_intro: >
  <p>I’d love to hear from you! Whether you have a question, want to collaborate, or just want to say hi, feel free to reach out.</p>

nav_buttons:
  - href: /docs/about/
    label: "About Me"
    icon: "fas fa-user-circle"
  - href: /docs/devops/
    label: "DevOps Projects"
    icon: "fas fa-project-diagram"

social_html: |
  <a href="mailto:jatinvashishtha110@gmail.com" title="Email Jatin via Gmail" aria-label="Email Jatin via Gmail">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail Badge" loading="lazy"/>
  </a>
  <a href="https://www.linkedin.com/in/jatin-devops/" target="_blank" rel="noopener" title="LinkedIn" aria-label="Visit Jatin on LinkedIn">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge" loading="lazy"/>
  </a>
  <a href="https://github.com/kioskog" target="_blank" rel="noopener" title="GitHub" aria-label="Visit Jatin on GitHub">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" loading="lazy"/>
  </a>
---

<!-- Contact Details -->
<section class="projects-section reveal" aria-labelledby="contact-details">
  <h2 id="contact-details">📇 Contact Details</h2>

  <article class="project-card card-teal reveal">
    <div class="card-link" tabindex="0">
      <p class="project-desc">Prefer email or socials? Use any of the quick links above. I usually respond within a couple of days.</p>
      <div class="tags">
        <span class="tag">Email</span>
        <span class="tag">LinkedIn</span>
        <span class="tag">GitHub</span>
      </div>
    </div>
  </article>
</section>

<!-- Collaboration -->
<section class="projects-section reveal" aria-labelledby="collab">
  <h2 id="collab">🤝 Looking to Collaborate?</h2>

  <article class="project-card card-purple reveal">
    <div class="card-link" tabindex="0">
      <p class="project-desc">
        Working on something interesting in DevOps, cloud architecture, or automation? I’m happy to explore opportunities and advise on platform choices, IaC, CI/CD, and observability.
      </p>
      <div class="tags">
        <span class="tag">DevOps</span>
        <span class="tag">Cloud</span>
        <span class="tag">Automation</span>
        <span class="tag">Observability</span>
      </div>
    </div>
  </article>
</section>

<!-- Quick Message Form -->
<section class="projects-section reveal" aria-labelledby="quick-message">
  <h2 id="quick-message">📝 Quick Message</h2>

  <article class="project-card card-gold reveal">
    <div class="card-link" tabindex="0">
      <p class="project-desc">
        Prefer a short note? Fill the form below and I’ll get back to you.
      </p>

      <!-- Replace the action URL with your real Formspree endpoint -->
      <form action="https://formspree.io/f/xldekddk" method="POST" style="margin-top:12px">
        <!-- Honeypot (spam protection) -->
        <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">

        <div style="display:grid; gap:14px">
          <label for="name">Name</label>
          <input id="name" name="name" type="text" required placeholder="Your name" />

          <label for="email">Email</label>
          <input id="email" name="_replyto" type="email" required placeholder="you@example.com" />

          <label for="message">Message</label>
          <textarea id="message" name="message" rows="5" required placeholder="How can I help?"></textarea>

          <!-- Optional metadata for subject -->
          <input type="hidden" name="_subject" value="New message from jatin.devops contact form" />
          <!-- Where to redirect after success (optional) -->
          <!-- <input type="hidden" name="_next" value="https://yourdomain/thanks/" /> -->

          <button type="submit" class="btn" style="align-self:center">Send Message <i class="fas fa-paper-plane" aria-hidden="true"></i></button>
        </div>
      </form>

      <div class="tags" style="margin-top:14px">
        <span class="tag">Secure</span>
        <span class="tag">Fast</span>
        <span class="tag">Formspree</span>
      </div>
    </div>
  </article>
</section>

<!-- CTA -->
<section class="projects-section reveal" aria-labelledby="cta" style="text-align:center">
  <h2 id="cta">📂 Or browse my work</h2>
  <a href="{{ '/docs/devops/' | relative_url }}" class="btn">DevOps Projects <i class="fas fa-project-diagram" aria-hidden="true"></i></a>
</section>
