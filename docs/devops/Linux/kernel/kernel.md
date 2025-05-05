---
title: Linux Kernel
layout: home
parent: Linux Projects
nav_order: 4
permalink: /docs/devops/Linux/kernel/kernel/
description: Documentation on Linux Kernel.
---

# Linux Kernel

## What is the Linux kernel?
The Linux kernel is the main component of a Linux operating system (OS) and is the core interface between a computer’s hardware and its processes. It communicates between the 2, managing resources as efficiently as possible.

{:. important}
> The kernel operates in a protected mode, is where os runs the kernel & that is where we share all the resources. i.e. 1 address space & we aren't isolating processes.

---

## What the kernel does? 
The kernel has 4 jobs:

1. **Memory management:** Keep track of how much memory is used to store what, and where

2. **Process management:** Determine which processes can use the central processing unit (CPU), when, and for how long

3. **Device drivers:** Act as mediator/interpreter between the hardware and processes

4. **System calls and security:** Receive requests for service from the processes


{: .note}
> The kernel, is invisible to the user, working in its own little world known as `kernel space`, where it allocates `memory` and keeps track of where everything is stored.
>
> What the user sees—like `web browsers` and `files` are known as the user space. These applications interact with the kernel through a system call interface (SCI).


So, its `multi-tasking`, you can runs multiple programs at the same time, & the kernel is there to give you memory, to give access to storage, to give access network in a common way. provides the pipe to go around the network stack & user space. And It's commanality of providing a `shim` layer above the hardware.

All the drivers live in kernel. so the kernel & drivers are all linux. Linux isn't a micro kernel architecture. Its a monolothic, so the code is all in the same address space. So, the bug in any one of them has a chance to take any part of the kernel down.

So, linux ships all the drivers for all the architecture in one big tarball.


{: .warning}
> There is saying in Kernel development: **Don't break user space on purpose.**

---

## Where the kernel fits within the OS?

To put the **kernel** in context, you can think of a Linux machine as having 3 layers:

1. **The Hardware:** The physical machine—the base of the system, made up of `memory (RAM)` and the `processor` or `central processing unit (CPU)`, as well as `input/output (I/O) devices` such as `storage`, `networking`, and `graphics`. The CPU performs computations and reads from, and writes to, memory.

2. **The Linux kernel:** The core of the OS. (See? It’s right in the middle.) It’s software residing in memory that tells the CPU what to do.

3. **User processes:** These are the running programs that the kernel manages. User processes are what collectively make up user space. User processes are also known as just processes. The kernel also allows these processes and servers to communicate with each other (known as inter-process communication, or IPC).



Code executed by the system runs on CPUs in 1 of 2 modes: `kernel mode` or `user mode`. Code running in the `kernel mode` has `unrestricted` access to the hardware, while `user mode` `restricts` access to the CPU and memory to the SCI (System Call Interface). A similar separation exists for memory (kernel space and user space). These 2 small details form the base for some complicated operations like privilege separation for `security`, `building containers`, and `virtual machines`.

---
