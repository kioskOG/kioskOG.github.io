---
title: Knative Serving Part-1
layout: home
parent: Knative Developer Overview
grand_parent: Knative
ancestor: Kubernetes Projects
nav_order: 1.5
permalink: /docs/devops/kubernetes/knative/knative-serving-part-1/
description: Documentation on knative serving
---


# 2. Knative Serving

## 2.1 A walkthrough

In this section, I’ll use kn exclusively to demonstrate some Knative Serving capabili- ties. I assume you’ve installed it, following the directions in appendix A.

`kn` is the `official` CLI for Knative, but it wasn’t the first. Before it came along there were a number of alternatives, such as knctl. These tools helped to explore different approaches to a CLI experience for Knative.
kn serves two purposes. The first is a CLI in itself, specifically intended for Knative rather than requiring users to anxiously skitter around kubectl, pretending that Kubernetes isn’t right there. The secondary purpose is to drive out Golang APIs for Knative, which can be used by other tools to interact with Knative from within Go programs.


### 2.1.1 Your first deployment

Let’s first use `kn service list` to ensure you’re in a clean state. You should see No Services Found as the response. 

Now we can create a Service using kn service create.

```bash
kn service create hello \
--image ghcr.io/knative/helloworld-go:latest \
--port 8080 \
--env TARGET=World
```

>> Expected Output:-

```bash
Creating service 'hello' in namespace 'default':

  0.042s The Route is still working to reflect the latest desired specification.
  0.047s Configuration "hello" is waiting for a Revision to become ready.
  0.069s ...
  8.968s ...
  8.991s Ingress has not yet been reconciled.
  9.049s Waiting for load balancer to be ready
  9.231s Ready to serve.

Service 'hello' created to latest revision 'hello-00001' is available at URL:
http://hello.default.13.235.153.216.sslip.io
```


The Service you provide is split into a `Configuration` and a `Route`. The `Configuration` creates a `Revision`. The `Revision` needs to be ready before the `Route` can attach Ingress to it, and Ingress needs to be ready before traffic can be served at the URL.

### 2.1.2 Your second deployment
> Updating hello service

```bash
kn service update hello \
--env TARGET=Second
```

>> Expected Output:-

```bash
Updating Service 'hello' in namespace 'default':

  0.046s The Configuration is still working to reflect the latest desired specification.
  3.105s Traffic is not yet migrated to the latest revision.
  3.106s Ingress has not yet been reconciled.
  3.106s Waiting for load balancer to be ready
  3.262s Ready to serve.

Service 'hello' updated to latest revision 'hello-00002' is available at URL:
http://hello.default.13.235.153.216.sslip.io
```


{: .important}
> You may have noticed that the revision name changed.

First was **hello-00001**, and Second was **hello-00002**. Yours will look slightly different because part of the name is randomly generated: `hello` comes from the name of the `Service`, and the 1 and 2 suffixes indicate the generation of the Service. But the bit in the middle is randomized to prevent accidental name collisions.

{: .note}
> Did `Second` replace `First`? The answer is—it depends who you ask. If you’re an end user sending HTTP requests to the URL, yes, it appears as though a total replace- ment took place. But from the point of view of a developer, both `Revisions` still exist, as shown in the following listing.


```bash
kn revision list

NAME          SERVICE   TRAFFIC   TAGS   GENERATION   AGE     CONDITIONS   READY   REASON
hello-00002   hello     100%             2            8m59s   3 OK / 4     True    
hello-00001   hello                      1            17m     3 OK / 4     True    
```

```bash
kn service describe hello

Name:       hello
Namespace:  default
Age:        21m
URL:        http://hello.default.13.235.153.216.sslip.io

Revisions:  
  100%  @latest (hello-00002) [2] (13m)
        Image:     ghcr.io/knative/helloworld-go:latest (pinned to ba756b)
        Replicas:  0/0

Conditions:  
  OK TYPE                   AGE REASON
  ++ Ready                  13m 
  ++ ConfigurationsReady    13m 
  ++ RoutesReady            13m
```


#### I can look more closely at each of these with kn revision describe. The following list-ing shows this.

```bash
kn revisions describe hello-00001
```

> Expected Output:-

```bash
Name:       hello-00001
Namespace:  default
Age:        22m
Image:      ghcr.io/knative/helloworld-go:latest (pinned to ba756b)
Replicas:   0/0
Port:       8080
Env:        TARGET=World
Service:    hello

Conditions:  
  OK TYPE                  AGE REASON
  ++ Ready                 22m 
  ++ ContainerHealthy      22m 
  ++ ResourcesAvailable    22m 
   I Active                22m NoTraffic
```


### 2.1.3 Conditions

It’s worth taking a slightly closer look at the Conditions table (above ). Software can be in any number of states, and it can be useful to know what these are. A smoke test or external monitoring service can detect that you have a problem, but it may not be able to tell you why you have a problem. What this table gives you is four pieces of information:


* `OK gives the quick summary about whether the news is good or bad`. The `++` signals that everything is fine. The `I` signals an informational condition. It’s not bad, but it’s not as unambiguously positive as `++`. If things were going badly, you’d see `!!`. If things are bad but not, like, bad bad, kn signals a warning condition with `W`. And if Knative just doesn’t know what’s happening, you’ll see `??`.

* `TYPE is the unique condition being described`. In this table, we can see four types reported. The Ready condition, for example, surfaces the result of an underlying Kubernetes readiness probe. Of greater interest to us is the `Active` condition, which tells us whether there is an instance of the Revision running.

* `AGE reports on when this condition was last observed to have changed`. In the example, these are all 22 minutes, but they don’t have to be.

* `REASON allows a condition to provide a clue as to deeper causes`. For example, our `Active` condition shows **NoTraffic** as its reason.



> ### So this line
>> `I Active 22m NoTraffic`
>>> Can be read as
>>>> “As of **22 minutes ago**, the Active condition has an Informational status due to NoTraffic.”


> ### Suppose we get this line:
>> `!! Ready 1h AliensAttackedTooSoon`
>>> We could read it as
>>>> “As of **an hour ago**, the `Ready` condition became not OK because the `AliensAttacked- TooSoon.`”


### 2.1.4 What does Active mean?

When the Active condition gives NoTraffic as a reason, that means there are no active instances of the Revision running. Suppose we poke it with curl as in the following listing.

```bash
kn revisions describe hello-00002

Name:       hello-00002
Namespace:  default
Age:        25m
Image:      ghcr.io/knative/helloworld-go:latest (pinned to ba756b)
Replicas:   0/0
Port:       8080
Env:        TARGET=Second
Service:    hello

Conditions:  
  OK TYPE                  AGE REASON
  ++ Ready                 25m 
  ++ ContainerHealthy      25m 
  ++ ResourcesAvailable    25m 
   I Active                 9m NoTraffic
```

```bash
curl http://hello.default.13.235.153.216.sslip.io/
```

```bash
kn revisions describe hello-00002

Name:       hello-00002
Namespace:  default
Age:        27m
Image:      ghcr.io/knative/helloworld-go:latest (pinned to ba756b)
Replicas:   1/1
Port:       8080
Env:        TARGET=Second
Service:    hello

Conditions:  
  OK TYPE                  AGE REASON
  ++ Ready                 27m 
  ++ ContainerHealthy      27m 
  ++ ResourcesAvailable    27m 
  ++ Active                 3s
```


{: .note}
> Note that we now see ++ Active without the NoTraffic reason. Knative is saying that a running process was created and is active. If you leave it for a minute, the process will shut down again and the Active Condition will return to complaining about a lack of traffic.


### 2.1.5 Updating the container image

```bash
kn service update hello --image ghcr.io/knative/helloworld-go:latest

Updating Service 'hello' in namespace 'default':

  0.048s The Configuration is still working to reflect the latest desired specification.
  2.802s Traffic is not yet migrated to the latest revision.
  2.803s Ingress has not yet been reconciled.
  2.829s Waiting for load balancer to be ready
  3.025s Ready to serve.

Service 'hello' updated to latest revision 'hello-00004' is available at URL:
http://hello.default.13.235.153.216.sslip.io
```

> And then I poke it

```bash
curl http://hello.default.13.235.153.216.sslip.io

Hello Second!
```

**There’s an important point to remember here:** 

{: .note}
> changing the `environment variable` caused the `second Revision` to come into being. Changing the image caused a third Revision to be created. But because I didn’t change the variable, the third Revision also says “Hello Second!” In fact, almost any update I make to a Service causes a new Revision to be stamped out.

{: .important}
> Almost any? What’s the exception? It’s Routes. Updating these as part of a Service won’t create a new Revision.

### 2.1.6 Splitting traffic

I’m going to prove that Route updates don’t create new Revisions by splitting traffic evenly between the last two Revisions. The next listing shows this split.

>> Splitting traffic 50/50

```bash
kn service update hello \
--traffic hello-00001=50 \
--traffic hello-00003=50

Updating Service 'hello' in namespace 'default':

  0.063s Ingress has not yet been reconciled.
  0.326s Waiting for load balancer to be ready
  0.525s Ready to serve.

Service 'hello' with latest revision 'hello-00003' (unchanged) is available at URL:
http://hello.default.13.235.153.216.sslip.io
```

The `--traffic` parameter shown in listing allows us to assign percentages to each Revision. The key is that the percentages must all add up to 100. If I give 50 and 60, I’m told that “given traffic percents sum to 110, want 100.” Likewise, if I try to cut some corners by giving 50 and 40, I get “given traffic percents sum to 90, want 100.” It’s my responsibility to ensure that the numbers add up correctly.

Does it work? Let’s see what the following listing does.

```bash
curl http://hello.default.13.235.153.216.sslip.io

Hello World!


curl http://hello.default.13.235.153.216.sslip.io

Hello Second!
```

{: .note}
> You don’t explicitly need to set traffic to 0%. You can achieve the same by leaving out Revisions from the list as shown in this listing.


Finally, if I am satisfied that latest revision is ready, I can switch over all the traffic using @latest as my target. The following listing shows this switch.

```bash
kn service update hello \
--traffic @latest=100

Updating Service 'hello' in namespace 'default':

  0.069s The Route is still working to reflect the latest desired specification.
  0.124s Ingress has not yet been reconciled.
  0.142s Waiting for load balancer to be ready
  0.318s Ready to serve.

Service 'hello' with latest revision 'hello-00003' (unchanged) is available at URL:
http://hello.default.13.235.153.216.sslip.io
```
