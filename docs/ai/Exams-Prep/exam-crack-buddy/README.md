# Exam Crack Buddy

A free study site for two certifications:

- **NVIDIA-Certified Associate: AI Infrastructure and Operations (NCA-AIIO)**
- **AWS Certified AI Practitioner (AIF-C01, exam guide v1.1)**

Each track has four sections:

- **Learn:** curriculum by domain, memory hooks, a sprint plan and exam traps.
- **Practice:** 100 questions with instant explanations.
- **Mock exam:** timed, real-format exam with flag-for-review, a review grid and results by domain.
- **Progress:** mastery by domain and mock history.

It is a static site with no server, no build step and no tracking. It works on any web host.

## Files

| File | Purpose |
|---|---|
| `index.html` | The app: layout, styles and logic |
| `data-nvidia.js` | NCA-AIIO curriculum and 100 questions |
| `data-aws.js` | AIF-C01 curriculum and 100 questions |

`exam-crack-buddy-single.html` (next to this folder in the zip) is the same app with everything in one file. Use it if your site builder only accepts a single HTML upload.

## Put it on your website

**Any static host or your own server (Apache, Nginx, cPanel):** upload the `exam-crack-buddy` folder. It is then available at `https://yoursite.com/exam-crack-buddy/`.

**GitHub Pages:**

1. Create a repository and add the three files to its root.
2. Go to Settings → Pages and select the `main` branch.

**Netlify or Vercel:** drag and drop the folder onto the dashboard.

**Embed inside an existing page** (WordPress, Webflow, Wix and similar). Host the files first, then add:

```html
<iframe src="https://yoursite.com/exam-crack-buddy/" title="Exam Crack Buddy"
        style="width:100%;height:90vh;border:0;border-radius:12px"></iframe>
```

To test locally, open `index.html` directly in a browser. Or run `python3 -m http.server` in the folder and visit `http://localhost:8000`.

## Editing questions

Questions live in the `questions` array in each data file. Each question has a domain field `d` that matches the domain `id` values in that file.

```js
// single answer (a = index of the correct option; options are shuffled on screen)
{ d: 2, q: "Question?", o: ["Right", "Wrong", "Wrong", "Wrong"], a: 0, e: "Explanation." }

// multiple response
{ d: 3, t: "multi", q: "Which TWO ...? (Select TWO.)", o: ["A", "B", "C", "D", "E"], a: [0, 2], e: "..." }

// ordering (list items in the correct order)
{ d: 1, t: "order", q: "Arrange ...", items: ["First", "Second", "Third"], e: "..." }

// matching (pairs of [prompt, answer])
{ d: 1, t: "match", q: "Match ...", pairs: [["Polly", "Text to speech"], ["Transcribe", "Speech to text"]], e: "..." }
```

The mock exam draws `mock.per` questions from each domain, so each domain needs at least that many questions. If you add questions, raise the numbers in `mock.per` to use them.

## Notes for publishing

- Progress is saved in each visitor's own browser (`localStorage`). Nothing is sent anywhere.
- Fonts load from Google Fonts. If you need fully offline or no third-party requests, delete the font `<link>` tags; the app falls back to system fonts.
- Light and dark themes follow the visitor's system setting.
- The footer disclaimer says the questions are original practice content and that the site is not affiliated with NVIDIA or AWS. Keep it when you publish.
- Exam details (question counts, timing, price) were checked in October 2026. Re-check the official pages before relying on them:
  - https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate/
  - https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html
