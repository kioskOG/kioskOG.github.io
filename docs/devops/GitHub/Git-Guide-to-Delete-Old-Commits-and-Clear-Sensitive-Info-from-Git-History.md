---
title: Git Guide to Delete Old Commits and Clear Sensitive Info from Git History
layout: doc-page
parent: GitHub
nav_order: 1
permalink: /docs/devops/GitHub/Git-Guide-to-Delete-Old-Commits-and-Clear-Sensitive-Info-from-Git-History/
description: How To Delete Old Git Commits and Clear Sensitive Files from History
type: concept
tags:
- devops
- github
timestamp: '2026-05-03T17:23:03Z'
---

# How To: Delete Old Git Commits and Clear Sensitive Files from History

## Introduction

Everyone works with GenAI apps (like `ChatGPT`, `Gemini` and `Claude`) and often forgets to delete the secret while pushing the code to **Git/GitHub/BitBucket** etc.

Accidentally committing sensitive information (like `passwords`, `API keys`, or `certificates`) to a Git repository is a common mistake.

Removing these sensitive files from your repository's history is critical to protect your project and users.

This guide provides step-by-step instructions for three common approaches to erase old commits and clear unwanted files, with a recommendation for the most robust solution.


*GitHub* has added the feature by NOT allowing the files to get pushed - but the user also has an option to force push with secret - which poses the security threat.

So take care while working with API keys in your code. Best practice is to use ENV variables and storing key as HASH string is always recommended.

---

## Why Is This Important?

Even if you delete a sensitive file and commit the changes, the sensitive data remains in the repository's history and can be recovered. To fully remove this information, you must rewrite your Git history.

<p align="center">
  <img src="/docs/devops/Github/images/Delete-Old-Git-Commits.png" alt="Github" width="700">
</p>


## Approach 1: Start Fresh — Remove All History
This method removes all commit history, leaving only your current files as a new initial commit.

### Steps:

1. Backup your repository!
2. Delete the Git history:

```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
```

3. (Optional) Rename your branch:

```bash
git branch -M main
```

4. Add your remote and force-push:

```bash
git remote add origin <remote-url>
git push -f origin main
```

#### Pros:

   * Simple and effective.

#### Cons:

   * Loses all commit history.
   * Disruptive for collaborators.


## Approach 2: Remove Specific Files — With git-filter-repo

If you need to delete specific files (like `.env`, `secrets.txt`) from every commit, use `git-filter-repo`.

### Steps:

1. Install git-filter-repo (if not already):

```bash
pip install git-filter-repo
# or
brew install git-filter-repo
```

2. Remove sensitive files from history:

```bash
git filter-repo --path <path-to-sensitive-file> --invert-paths
```

Example for multiple files:

```bash
git filter-repo --path secret.env --path private.pem --invert-paths
```

3. Force-push changes:

```bash
git push -f origin main
```

#### Pros:

   * Precise: removes only targeted files.
   * Preserves useful history for all other files.

#### Cons:

   * Still rewrites history (force-push required).
   * All collaborators must re-clone or reset local branches.


## Approach 3: Squash All Commits Into One
This approach creates a single new commit with only your current files, erasing all previous history (including sensitive data) but preserving your current project state.

### Steps:

1. Create a new orphan branch (no history):

```bash
git checkout --orphan latest_branch
```


2. Stage and commit all files:

```bash
git add -A
git commit -m "Initial commit with all current files"
```

3. Delete the old branch and rename the new one:

```bash
git branch -D main
git branch -m main
```

4. Force-push to your remote:

```bash
git push -f origin main
```


#### Pros:

   * Completely erases old history, including all sensitive files or data.
   * Leaves you with a clean slate and current state.

#### Cons:

   * All previous commit history is lost.
   * Requires force-push; all collaborators must re-clone.



## Recommendation: Use Approach 3 (Squash All Commits Into One)

While all three approaches can remove sensitive data, squashing all commits is often the best choice for these reasons:

   * It guarantees that all traces of sensitive information are erased.
   * Leaves your repository clean and easy to maintain.
   * Is simple to execute, with minimal risk of missing hidden copies of sensitive files.

### Important:

After rewriting history, you must force-push (`git push -f`). All collaborators must re-clone or reset their local repositories to avoid conflicts.


## Final Steps

1. **Invalidate Old Credentials:** If you committed passwords or keys, assume they are compromised. Change them immediately.
2. **Add Sensitive Files to `.gitignore`:** Prevent accidental future commits.
3. **Notify Collaborators:** Let everyone know to re-clone the repository.
4. **Check Remotes:** Ensure you are pushing to the correct repository and branch.
