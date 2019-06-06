[![CircleCI](https://circleci.com/gh/ffoysal/kioshi/tree/master.svg?style=svg)](https://circleci.com/gh/ffoysal/kioshi/tree/master)

# Deployments

## kubernetes (kops)

Assuming [kops](https://github.com/kubernetes/kops) has been installed on your development machine as well as `aws-cli` and `kubectl`.

### Create an S3 bucket

As `kops` uses S3 bucket to store the state and configuration of your Kubernetes cluster:

```
aws s3api create-bucket \
    --bucket kioshi-k8s-store \
    --region us-east-1
```

_This bucket name may not be available please replace your bucket name here._

### Set environement vriables for easy life

```
export NAME=kioshi.k8s.local
export KOPS_STATE_STORE=s3://kioshi-k8s-store
```

### Create Cluster Config

This will create cluster with micro instances. So production please follow the recomanded size in [here](https://github.com/kubernetes/kops)
```
kops create cluster \
  --name=kioshi.com.k8s.local \
  --state=s3://kioshi-k8s-store \
  --zones=us-east-1a \
  --node-count=2 \
  --node-size=t2.micro \
  --master-size=t2.micro
```

### Build the cluster

```
kops update cluster ${NAME} --yes
```
You will see the output like this. But the cluster creation has not been completed yet.

```
Cluster is starting.  It should be ready in a few minutes.
```

### Verify Cluster

Validate if the cluster creation is done or not using the command
```
kops validate cluster
```
The above command will produce all the node info as well as
```
Your cluster kioshi.k8s.local is ready
```

### Check all nodes are ready

```
kubectl get nodes
```
Running the above command will produce something like
```
NAME                            STATUS   ROLES    AGE   VERSION
ip-172-20-37-130.ec2.internal   Ready    master   3h    v1.11.9
ip-172-20-40-220.ec2.internal   Ready    node     3h    v1.11.9
ip-172-20-52-48.ec2.internal    Ready    node     3h    v1.11.9
```
if not wait until output looks like that.

### Deploy The Service

To checkout and deploy the service do the following commands in order
```
git clone https://github.com/ffoysal/kioshi.git
```
```
cd kioshi/kubernetes
```
```
kubectl apply -f .
```

Verify if pods are in running state, if not pelase check and wait
```
kubectl get pods
```
will produce something like
```
NAME                                 READY   STATUS    RESTARTS   AGE
kioshi-deployment-647558c554-5vvw8   1/1     Running   1          1h
kioshi-deployment-647558c554-sd67m   1/1     Running   1          1h
mongo-788bf5f674-2hmqh               1/1     Running   0          1h
```
Don't worry about `RESTART` colloumn. The app restart if db is not available. DB should be available eventually.

To list all the servicees please do
```
kubectl get service
```
output will be
```
frontend     LoadBalancer   100.71.140.141   <uri>.us-east-1.elb.amazonaws.com   80:31619/TCP   3h
kubernetes   ClusterIP      100.64.0.1       <none>                                                                    443/TCP        3h
mongo        ClusterIP      100.68.179.157   <none>                                                                    27017/TCP      1h
```
The `frontend` service can be accessed by this url `<uri>.us-east-1.elb.amazonaws.com`

The supported paths by the app are 

`<uri>.us-east-1.elb.amazonaws.com/health`

`<uri>.us-east-1.elb.amazonaws.com/messages`

`<uri>.us-east-1.elb.amazonaws.com/docs`

All the supported operations and examples are provided in `/docs` path.

The api endpoint are in the path `/messages`

To verify the apis please use `curl` or `postman`
_Note `try out` button in swagger ui will not work for this deployment._

### Delete Cluster

To delete the kubernetes cluster
```
kops delete cluster --yes
```
