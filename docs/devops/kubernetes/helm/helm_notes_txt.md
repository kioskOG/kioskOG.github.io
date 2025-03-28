---
title: Helm Notes NOTES.txt File
layout: home
parent: What is HELM | Why We Need HELM | Create HELM Chart?
grand_parent: Kubernetes Projects
nav_order: 6
permalink: /docs/devops/kubernetes/helm/helm_notes_txt/
description: Documentation for Creating a NOTES.txt File
---

To add installation notes to your chart, simply create a `templates/NOTES.txt` file. This file is plain text, but it is processed like a template, and has all the normal template functions and objects available.


Let's create a simple `NOTES.txt` file:

```bash
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}
```

Now if we run  `helm install first --debug ./mychart` we will see the above message at the bottom.


Using `NOTES.txt` this way is a great way to give your users detailed information about how to use their newly installed chart. Creating a `NOTES.txt` file is strongly recommended, though it is not required.

