# LeagueIO

## Game Design
https://docs.google.com/document/d/1lkn_6DEJM0_5s4hQyzyCxnCK3TgB1-iweKnq1r7r-4c/edit#

## Local Development

`npm run watch`: Watches webpack, tsc, and node for changes. Will hot reload files and server when it detects changes.

`npm run watch:debug`: Run npm watch in debug mode so you can debug the server

`npm run lint`: Run ESLint on project

If on vscode make sure to enable `Node: Auto Attach` under `Preferences > Settings > Debug > Node: Auto Attach`.

## Running Agones Locally on Minikube

Make sure you have minikube [downloaded](https://kubernetes.io/docs/tasks/tools/install-minikube/).

```bash
# make sure we don’t overlap any existing Minikube clusters you may be running.
minikube profile agones

# You will need to choose a hypervisor I use vmware (you need to buy) hyperkit is free (have not tested though)
# If this doesn't work well you can also use docker desktop
# Full list https://minikube.sigs.k8s.io/docs/drivers/
brew install hyperkit

# start up kubernetes 
minikube start --kubernetes-version v1.15.10 --vm-driver hyperkit

# create namespace for agones
kubectl create namespace agones-system
kubectl apply -f https://raw.githubusercontent.com/googleforgames/agones/release-1.7.0/install/yaml/install.yaml

# Make sure agones is healthy
# Conditions:
# Type              Status
# Initialized       True
# Ready             True
# ContainersReady   True
# PodScheduled      True
kubectl describe --namespace agones-system pods

# NAME                                 READY   STATUS    RESTARTS   AGE
# agones-allocator-5c988b7b8d-cgtbs    1/1     Running   0          8m47s
# agones-allocator-5c988b7b8d-hhhr5    1/1     Running   0          8m47s
# agones-allocator-5c988b7b8d-pv577    1/1     Running   0          8m47s
# agones-controller-7db45966db-56l66   1/1     Running   0          8m44s
# agones-ping-84c64f6c9d-bdlzh         1/1     Running   0          8m37s
# agones-ping-84c64f6c9d-sjgzz         1/1     Running   0          8m47s
kubectl get pods --namespace agones-system

# This command will allow you to use minikube as your docker context and registry
eval $(minikube docker-env)

# This gives the default service account admin priviledges. We can probably lower this in production.
# Since kubectl allocates the server in our node server, the service account requires certain permissions
kubectl create clusterrolebinding service-cluster-admin \
  --clusterrole=cluster-admin  \
  --serviceaccount=default:default

# Build code, build docker container to local registry, apply fleet and service
npm run agones:local

# Commands run by agones:local
npm run build # build dist
kubectl delete fleet --all # deletes fleet
eval $(minikube docker-env) # make sure docker context is set
docker image rmi playmoba:latest # delete existing container
docker build -t playmoba . # build container with tag name playmoba:latest
kubectl apply -f kubeConfig/minikube/fleet.yaml # apply fleet
kubectl apply -f kubeConfig/minikube/autoscaler.yaml # apply autoscaler
kubectl apply -f kubeConfig/service.yaml # apply service

# Pull up service entry point
npm run agones:node

# Command run by agones:node
minikube service my-service
```

## Useful Commands for Agones on Minikube

```bash
# Check what images exist on machine
docker image ls

# Check what docker containers are running 
docker ps

# Startup Minikube Dashboard
minikube dashboard

# Kubectl is the primary way you can see what is happening in kubernetes
# Get all pods in cluster
kubectl get pods

# Get game server in cluster
kubectl get gs <game server/ pod name>
kubectl get gs --all # get all
kubectl delete gs <name> # delete one
kubectl delete gs --all # delete all note if you have a fleet running the gs will restart

# Apply fleet
kubectl apply -f ./kubeConfig/minikube/fleet.yaml

# Get fleet in cluster
kubectl get fleet <fleetname>
kubectl get fleet --all # get all
kubectl delete gs <name> # delete one
kubectl delete gs --all # delete all

# Get logs for a pod
kubectl logs <podname>
```

## Background Reading about Agones

[Quickstart guides](https://agones.dev/site/docs/getting-started/)
- Game Server: basic unit can be thought of as kubernetes pod
- Game Server Fleet: can be thought of as kubernetes deployment; helps with updates and defines a replica set
- Fleet Autoscaler: Another service we can define for scaling the cluster

[Reference Doc](https://agones.dev/site/docs/reference/): specs on yaml files

[Client SDK: What apis are available to us from the server side](https://agones.dev/site/docs/guides/client-sdks/)

[Websocket basic example](https://github.com/wwitzel3/agones-websocket)

## Background Reading about Kubernetes

[Ingress options in Kubernetes](https://medium.com/google-cloud/kubernetes-nodeport-vs-loadbalancer-vs-ingress-when-should-i-use-what-922f010849e0)

[Simple example using loadbalancer service](https://kubernetes.io/docs/tutorials/stateless-application/expose-external-ip-address/)

[More docs about Services & Ingress](https://kubernetes.io/docs/concepts/services-networking/service/)
