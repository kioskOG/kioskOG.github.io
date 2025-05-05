---
title: What is eBPF and Why is it Important?
layout: home
parent: Linux Projects
nav_order: 5
permalink: /docs/devops/Linux/eBPF/
description: Documentation on Linux Kernel
---

# What is eBPF and Why is it Important?

>> A revolutionary kernel technology that allows developers to write custom code that can be loaded into the kernel dynamically, changing the way the kernel behaves.


eBPF allows you to write custom code that changes the way the kernel behaves without having to implement a kernel module or integrate your code directly into the kernel.

---

It is helpful to distinguish between the `kernel` and the `userspace`. Userspace programs run in a layer on top of the `kernel` that cannot access hardware directly. To perform work, `userspace` applications make requests to the kernel using the system call `(syscall)` interface. For example, a userspace program may use a system call implemented by the kernel to read and write files, or send and receive network traffic.


![kernel system calls](/docs/devops/Linux/eBPF/image.png)


A `userspace` program may make hundreds of system calls to perform even simple operations. Many of these system calls are hidden from the developer through libraries and SDKs. For example, using the `echo` utility to print the statement `“Hello World”` results in **113 system calls**.


```bash
strace -c echo "Hello World"

Hello World
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 30.44    0.000200         200         1           execve
 21.61    0.000142           6        22           mmap
 20.09    0.000132           4        30        12 openat
  7.31    0.000048           2        20           close
  7.31    0.000048           2        19           fstat
  3.04    0.000020           6         3           mprotect
  1.83    0.000012          12         1           munmap
  1.52    0.000010          10         1           write
  1.52    0.000010           3         3           brk
  1.37    0.000009           3         3           read
  0.76    0.000005           2         2           pread64
  0.61    0.000004           4         1         1 access
  0.61    0.000004           4         1           getrandom
  0.46    0.000003           3         1           set_robust_list
  0.30    0.000002           2         1           arch_prctl
  0.30    0.000002           2         1           futex
  0.30    0.000002           2         1           set_tid_address
  0.30    0.000002           2         1           prlimit64
  0.30    0.000002           2         1           rseq
------ ----------- ----------- --------- --------- ----------------
100.00    0.000657           5       113        13 total
```

**System call:** This column lists the name of each system call. System calls are how a user-space process requests services from the kernel.

**% time:** The percentage of total time spent in that system call.

**seconds:** The total number of seconds spent in that system call.

**usecs/call:** The average number of microseconds per call to that system call.

**calls:** The total number of times that system call was invoked.

**errors:** The number of calls to this syscall resulting in an error

**total:** The last row provides the totals for time, calls, and errors.

---

Even simple applications rely heavily on the kernel, which means that if we can understand and observe the system calls that an application makes we can learn a lot about applications as well. `eBPF` allows just this functionality — intercepting the system calls an application makes and running custom code using the data in those calls.


Before `eBPF`, this level of integration with the Linux kernel required adding new functionality to the kernel itself. Either through contributing making edits to the around `40 million lines of code` in the kernel or writing a kernel module that can be loaded into the kernel during the compilation process.


`eBPF` offers a new approach to modifying kernel behaviour by allowing programs to be loaded into and removed from the kernel dynamically. Once an `eBPF` program is loaded, it can be attached to system call events. Whenever the relevant system call event occurs, the `eBPF` program is ran. For example, if you attach an `eBPF` program to the system call for opening files, it will be triggered whenever any process tries to open a file.


![eBPF](/docs/devops/Linux/eBPF/eBPF.png)

---

## Safety and Verification

When loading an eBPF program into the kernel, a verification step ensures that the eBPF program is safe to run.

Verification handles any concerns that an eBPF program can crash the kernel and bring down the entire system. Several aspects of the program are validated:


* The program has the correct privileges to execute.

* No uninitialized variables or incorrect memory access occurs.

* The program is small enough to fit within system constrains.

* The program always runs to completion. An eBPF program is only accepted if the verifier can ensure that any loops 

* contain an exit condition which is guaranteed to become true.

* The program must have a finite complexity.


## Performance

Once an eBPF program has been verified safe, it goes through a just-in-time (JIT) compilation process translating the eBPF bytecode into machine specific instructions that optimize execution speed. This makes eBPF programs run as efficiently as code loaded as a kernel module.

## Summary

* **Programmability:** eBPF allows users to dynamically inject custom code into the kernel without the need to modify or recompile the kernel itself.

* **Observability:** eBPF enables users to collect detailed information about a wide variety of kernel and user-space events

* **Security:** eBPF programs go through a verification process before they are allowed to run in the kernel, reducing the risk of introducing malicious code.
