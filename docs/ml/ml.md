---
layout: ml
title: ML | Jatin Sharma
nav_order: 4
permalink: /docs/ml/
hero_tag: Machine Learning
hero_title: 🧠 Machine Learning
hero_intro: <p>Exploring machine learning models, distributed training, and AI infrastructure.</p>
type: concept
tags:
- ml
timestamp: '2026-06-03T10:14:12Z'
---

<!-- Machine Learning Projects -->
<section class="projects-section reveal" aria-labelledby="ml-heading">
  <h2 id="ml-heading">🧠 Machine Learning Focus</h2>

  <div class="bento-projects-grid">
    <article class="project-card card-teal wide reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">Basics of AI & Machine Learning</h3>
          <a class="project-open" href="/docs/ml/basics/" aria-label="View Basics of AI & ML series">
            View Series <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">A comprehensive 8-part engineering guide covering the foundations of AI, Machine Learning, Deep Learning, Generative AI, ML task types, and the end-to-end ML lifecycle from business problem to continuous production optimization.</p>
        <div class="tags">
          <a class="tag" href="/docs/ml/basics/ai-ml-dl-genai-overview/">1. AI, ML, DL & GenAI</a>
          <a class="tag" href="/docs/ml/basics/how-machines-learn/">2. How Machines Learn</a>
          <a class="tag" href="/docs/ml/basics/machine-learning-lifecycle/">3. ML Lifecycle</a>
          <a class="tag" href="/docs/ml/basics/business-problem-and-ml-framing/">4. Problem Framing</a>
          <a class="tag" href="/docs/ml/basics/ml-tasks-and-model-types/">5. ML Tasks & Metrics</a>
          <a class="tag" href="/docs/ml/basics/data-collection-and-preparation/">6. Data Prep</a>
          <a class="tag" href="/docs/ml/basics/model-training-and-evaluation/">7. Training & Eval</a>
          <a class="tag" href="/docs/ml/basics/model-inference-and-optimization/">8. Inference & Optimization</a>
          <a class="tag" href="/docs/ml/basics/recap-what-we-learnt/">9. Recap & Cheat Sheet</a>
        </div>
      </div>
    </article>

    <article class="project-card card-teal normal reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">Training & Inference Pipelines</h3>
          <a class="project-open" href="/docs/ml/building-a-dataset-pipeline/" aria-label="View ML docs">
            View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">Content covering machine learning models, deployment patterns, and optimization techniques.</p>
        <div class="tags">
          <a class="tag" href="/docs/ml/building-a-dataset-pipeline/">MLOps Step 1: Building a Dataset Pipeline</a>
        </div>
      </div>
    </article>

    <!-- Animated MLOps Pipeline Simulator -->
    <div class="pipeline-simulator-card normal reveal">
      <h3 class="project-title" style="margin-bottom: 20px; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-green);">
        <i class="fas fa-microchip"></i> Live CT Pipeline Status
      </h3>
      <div class="pipeline-flow">
        <div class="pipeline-connector c1" id="c1"></div>
        <div class="pipeline-connector c2" id="c2"></div>
        <div class="pipeline-connector c3" id="c3"></div>

        <div class="pipeline-step" id="step-data">
          <i class="fas fa-database"></i>
          <span>Data Extraction & Validation</span>
        </div>
        <div class="pipeline-step" id="step-train">
          <i class="fas fa-dumbbell"></i>
          <span>Distributed Training Loop</span>
        </div>
        <div class="pipeline-step" id="step-eval">
          <i class="fas fa-flask"></i>
          <span>Evaluation & Quality Gate</span>
        </div>
        <div class="pipeline-step" id="step-deploy">
          <i class="fas fa-cloud-upload-alt"></i>
          <span>Promote to Model Registry</span>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
  (function() {
    var steps = [
      { step: document.getElementById('step-data'), conn: null },
      { step: document.getElementById('step-train'), conn: document.getElementById('c1') },
      { step: document.getElementById('step-eval'), conn: document.getElementById('c2') },
      { step: document.getElementById('step-deploy'), conn: document.getElementById('c3') }
    ];
    var current = 0;

    function runPipeline() {
      // Clear all
      steps.forEach(function(s) {
        if (s.step) s.step.className = 'pipeline-step';
        if (s.conn) s.conn.className = 'pipeline-connector ' + s.conn.id;
      });

      // Animate current
      var s = steps[current];
      if (s.step) s.step.classList.add('active');

      // Set completed for previous
      for (var i = 0; i < current; i++) {
        if (steps[i].step) steps[i].step.classList.add('completed');
        if (steps[i + 1].conn) steps[i + 1].conn.classList.add('completed');
      }

      if (steps[current].conn) {
        steps[current].conn.classList.add('active');
      }

      current = (current + 1) % steps.length;
      setTimeout(runPipeline, 2800);
    }

    if (steps[0].step) {
      setTimeout(runPipeline, 100);
    }
  })();
</script>
