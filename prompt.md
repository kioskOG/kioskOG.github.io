# Premium Listen to Article — Version 2.1 Enhancement Plan

The proposed future enhancements have been reviewed.

Do not implement all seven features at once.

Proceed with a focused Version 2.1 containing the following four enhancements:

1. Smart Pronunciation Dictionary
2. Media Session API Integration
3. Audio Bookmarks
4. Estimated Listening Time

Do not implement the following features yet:

* Multi-article Listen Queue
* Interactive Transcript Mode
* Per-language Voice Memory

These should remain future enhancements.

The goal of Version 2.1 is to significantly improve narration quality, native browser integration, knowledge retention, and listening UX without unnecessarily increasing architectural complexity.

---

# 1. Smart Pronunciation Dictionary

Implement a dedicated text-normalization layer between article extraction and the speech engine.

The architecture should become conceptually:

```text
Article DOM
    |
    v
Article Extractor
    |
    v
Sentence Segmenter
    |
    v
Speech Text Normalizer
    |
    v
Speech Queue
    |
    v
Speech Engine
```

Create a dedicated module:

```text
assets/js/tts/speech-normalizer.js
```

Do not put pronunciation rules directly inside:

* `article-extractor.js`
* `sentence-segmenter.js`
* `speech-engine.js`

The normalizer must remain an independent transformation layer.

## Core Principle

Maintain two versions of sentence content.

Conceptually:

```js
{
  sentenceIndex: 42,
  displayText: "Deploy the app to EKS using kubectl.",
  speechText: "Deploy the app to E K S using cube control."
}
```

The original article text must remain unchanged.

Use:

`displayText`

for:

* Highlighting
* Bookmarks
* UI
* Search
* Article synchronization

Use:

`speechText`

only for:

`SpeechSynthesisUtterance`

Never modify the visible article DOM to improve pronunciation.

## Initial Dictionary

Create a centralized, configurable dictionary for common DevOps, Cloud, Kubernetes, AI, and MLOps terminology.

Examples may include:

```text
K8s -> Kubernetes
K3s -> K three S
CLI -> C L I
API -> A P I
AWS -> A W S
GCP -> G C P
IAM -> I A M
EKS -> E K S
AKS -> A K S
GKE -> G K E
VPC -> V P C
EC2 -> E C two
S3 -> S three
RDS -> R D S
DNS -> D N S
HTTP -> H T T P
HTTPS -> H T T P S
TCP -> T C P
UDP -> U D P
SSH -> S S H
TLS -> T L S
SSL -> S S L
JWT -> J W T
SAML -> SAML
OIDC -> O I D C
CI/CD -> C I C D
GitHub -> Git Hub
GitLab -> Git Lab
kubectl -> cube control
Terraform -> Terraform
Terragrunt -> Terra grunt
PostgreSQL -> Postgres Q L
MySQL -> My S Q L
DevOps -> Dev Ops
MLOps -> M L Ops
LLM -> L L M
RAG -> R A G
GPU -> G P U
CPU -> C P U
RAM -> RAM
YAML -> YAML
JSON -> Jason
```

These are examples only.

Review pronunciation behavior before finalizing the initial dictionary.

Do not blindly transform every occurrence.

## Normalization Safety

Avoid replacements inside larger unrelated words.

Prefer:

* Word boundaries
* Token-aware replacement
* Case-aware matching where appropriate

For example:

Replacing:

`IAM`

must not accidentally modify text containing those letters as part of another word.

Support future extensibility.

The dictionary architecture should make it easy to:

* Add terms
* Remove terms
* Override pronunciation
* Add article-specific pronunciation rules later

## URLs and Technical Content

Add lightweight normalization for:

* URLs
* Version numbers
* Common command names
* Cloud service names

Do not attempt to narrate long raw URLs character-by-character.

Prefer sensible transformations where reliable.

Do not overengineer a complete natural-language-processing system.

---

# 2. Media Session API Integration

Create:

```text
assets/js/tts/media-session-controller.js
```

Integrate with:

`navigator.mediaSession`

when supported.

The implementation must use progressive enhancement.

The TTS player must continue functioning normally when Media Session API is unavailable.

## Media Metadata

When an article is loaded, provide metadata where supported.

Conceptually:

```js
navigator.mediaSession.metadata = new MediaMetadata({
  title: articleTitle,
  artist: siteName,
  album: "Listen to Article"
});
```

If the article has a suitable social/OG image, optionally use it as artwork.

Do not require artwork.

## Media Controls

Register supported action handlers.

Map:

```text
play          -> engine.play() or resume()
pause         -> engine.pause()
previoustrack -> previous sentence
nexttrack     -> next sentence
stop          -> stop playback
```

Only register actions supported by the browser.

Handle unsupported action registration gracefully.

## Playback State

Synchronize:

```js
navigator.mediaSession.playbackState
```

with the authoritative TTS engine state.

Conceptually:

```text
playing -> playing
paused  -> paused
idle    -> none
ready   -> none
completed -> none
error -> none
```

Do not allow the Media Session controller to become a second source of playback state.

It must subscribe to the authoritative engine/store state.

## Important Limitation

Do not claim guaranteed lock-screen background playback.

The Web Speech API and Media Session API have browser/platform-specific limitations.

Document actual supported behavior.

---

# 3. Audio Bookmarks

Implement sentence-level listening bookmarks.

Create:

```text
assets/js/tts/bookmark-store.js
```

Use a separate versioned storage key:

```text
tts-bookmarks:v1
```

Do not mix bookmarks into:

```text
tts-player-session:v1
```

or:

```text
tts-player-preferences:v1
```

## Bookmark Data Model

Conceptually:

```js
{
  id: "generated-bookmark-id",
  articleId: "stable-article-id",
  articleUrl: "/docs/example/",
  articleTitle: "Example Article",
  sentenceIndex: 42,
  displayText: "The bookmarked sentence.",
  createdAt: "ISO-8601 timestamp"
}
```

Optionally include:

```js
{
  headingContext: "Production Architecture"
}
```

if this information already exists in the semantic speech model.

Do not store:

* DOM nodes
* DOM Range objects
* SpeechSynthesisUtterance objects
* Runtime engine data

## Bookmark Action

Add:

`Bookmark Current Sentence`

to the main player.

Optionally add a compact bookmark action to the floating player if it does not clutter the interface.

When clicked:

1. Determine the active sentence.
2. Read its `displayText`.
3. Read article metadata.
4. Save the bookmark.
5. Provide subtle visual confirmation.

Avoid duplicate bookmarks for the exact same:

```text
articleId + sentenceIndex
```

If the same sentence is already bookmarked, either:

* Disable the bookmark action
* Or turn the action into Remove Bookmark

Prefer a toggle behavior if it produces cleaner UX.

## Bookmark Persistence

Validate stored bookmark data.

Handle:

* Corrupted JSON
* Missing fields
* Old schema versions
* Duplicate bookmarks
* Deleted articles
* Article content changes

A bookmark should remain useful even if the article's sentence indexes change.

Therefore:

`displayText`

must always be stored.

## My Bookmarks Page

Create a dedicated Jekyll page for saved bookmarks.

Follow the repository's existing page/layout conventions.

Possible route:

```text
/bookmarks/
```

Display bookmarks grouped by article.

Each bookmark should show:

* Article title
* Sentence text
* Heading context where available
* Created date
* Open Article action
* Remove Bookmark action

If technically practical, the Open Article action may include enough information to restore or locate the bookmarked sentence.

Do not promise exact sentence navigation if the article content has changed.

## Privacy

All bookmarks must remain local to the browser.

No backend.

No account.

No API.

No analytics events unless the repository already has an established analytics architecture and explicit reason to track the feature.

Clearly communicate:

`Bookmarks are stored locally in this browser.`

---

# 4. Estimated Listening Time

Implement an estimated listening-time system.

This is an estimate only.

Never represent estimated duration as exact audio duration.

Create a small pure utility.

Possible file:

```text
assets/js/tts/listening-time.js
```

## Estimation Model

Calculate estimated listening time using the remaining normalized speech word count.

Use a configurable baseline.

For example:

```text
1.0x = approximately 150 words per minute
```

Then adjust based on selected playback rate.

Conceptually:

```text
effectiveWPM = baseWPM * playbackRate
```

And:

```text
remainingMinutes = remainingWordCount / effectiveWPM
```

Do not calculate ETA solely from sentence count.

Use the actual remaining speech word count.

Because the pronunciation normalizer may expand:

```text
EKS
```

into:

```text
E K S
```

prefer calculating estimates from:

`speechText`

rather than:

`displayText`.

## UI

Display estimated listening time in the main player.

Examples:

```text
About 8 min remaining
```

```text
About 2 min remaining
```

```text
Less than 1 min remaining
```

Optionally display total estimated listening time before playback starts:

```text
Listen to Article · About 12 min
```

When playback speed changes, immediately recalculate the estimate.

Do not show fake:

```text
04:32 / 18:45
```

timestamps.

Keep sentence-based progress as the authoritative progress model.

Listening time is supplementary information.

## Future Calibration Compatibility

Structure the estimation utility so it could later support personalized calibration.

For example, a future version could compare:

* Estimated speech duration
* Observed completion time
* Selected voice
* Selected rate

Do not implement personalized calibration now.

Only keep the utility architecture extensible.

---

# 5. Integration Architecture

After Version 2.1, the architecture should conceptually be:

```text
                         Jekyll Article DOM
                                  |
                                  v
                         Article Extractor
                                  |
                                  v
                        Sentence Segmenter
                                  |
                                  v
                        Speech Normalizer
                                  |
                                  v
                            Speech Queue
                                  |
                                  v
                            Speech Engine
                                  |
                                  v
                         Authoritative State
                                  |
              +-------------------+-------------------+
              |                   |                   |
              v                   v                   v
        Article Player      Floating Player     Media Session
              |
              +-------------------+
              |                   |
              v                   v
      Sentence Highlight    Follow Narration


         Bookmark Action
                |
                v
         Bookmark Store
                |
                v
        My Bookmarks Page


         Speech Queue
                |
                v
      Listening Time Utility
                |
                v
        Estimated Time UI
```

Maintain separation of concerns.

Do not allow:

* Speech engine to manage bookmarks
* Bookmark store to manipulate speech
* Media Session controller to own playback state
* Listening-time utility to manipulate UI
* Speech normalizer to modify article DOM

---

# 6. Features Explicitly Deferred

Do not implement the following in Version 2.1.

## Multi-Article Listen Queue

Defer because the current Jekyll MPA architecture cannot provide truly seamless cross-article playback without additional navigation architecture.

Revisit later.

## Interactive Transcript Mode

Defer until the core highlighting, bookmarking, and speech lifecycle are proven stable.

## Per-Language Voice Memory

Defer until the website contains enough multilingual content to justify the additional preference model.

---

# 7. Validation Requirements

After implementation, validate:

## Speech Normalizer

* Technical acronyms.
* Mixed-case terminology.
* Terms inside larger words.
* URLs.
* Version numbers.
* Original DOM remains unchanged.
* `displayText` remains unchanged.
* Only `speechText` is normalized.

## Media Session

* Supported browser.
* Unsupported browser.
* Play action.
* Pause action.
* Previous sentence.
* Next sentence.
* Stop.
* Metadata update.
* Article switching.
* Engine completion.
* Engine error.

## Bookmarks

* Add bookmark.
* Remove bookmark.
* Prevent duplicates.
* Multiple bookmarks in one article.
* Bookmarks across multiple articles.
* Corrupted localStorage.
* Deleted article.
* Changed article content.
* Empty bookmark state.
* Mobile UI.
* Keyboard accessibility.

## Estimated Listening Time

* Initial estimate.
* Remaining estimate.
* Speed changes.
* Normalized speech expansion.
* Empty queue.
* Completed article.
* Single sentence.
* Very long article.

---

# 8. Implementation Workflow

Proceed using:

## Phase 1 — Repository Verification

Reconfirm the current Version 2 implementation architecture.

Identify exact integration points for the four enhancements.

Do not redesign working Version 2 architecture unnecessarily.

## Phase 2 — Implementation Plan

Provide:

* Files to create.
* Files to modify.
* Data model changes.
* Event flow changes.
* Storage schema.
* UI changes.
* Compatibility considerations.

## Phase 3 — Implementation

Implement:

1. Smart Pronunciation Dictionary.
2. Media Session API integration.
3. Audio Bookmarks.
4. Estimated Listening Time.

Keep commits or logical changes clearly separated where practical.

## Phase 4 — Validation

Run:

* Jekyll production build.
* Existing validation tooling.
* Manual feature validation.

Fix all implementation-related errors.

## Phase 5 — Final Report

Provide:

1. Implementation summary.
2. Files created.
3. Files modified.
4. Speech normalization architecture.
5. Initial pronunciation dictionary.
6. Media Session integration.
7. Bookmark architecture.
8. My Bookmarks page.
9. Estimated listening-time algorithm.
10. Storage changes.
11. UI changes.
12. Accessibility behavior.
13. Browser limitations.
14. Validation performed.
15. Build results.
16. Known limitations.
17. Recommended Version 2.2 improvements.

Proceed with Version 2.1 implementation after verifying compatibility with the existing Version 2 architecture.

Do not request further approval unless a genuinely blocking architectural conflict is discovered.

Prioritize narration quality and Media Session integration first, followed by bookmarks and estimated listening time.
