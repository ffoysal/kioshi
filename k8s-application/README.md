# K8s-application

The mms app can be installed as k8s application in GKE.

## Prerequisits

Follow [this](https://github.com/GoogleCloudPlatform/marketplace-k8s-app-tools/blob/master/docs/tool-prerequisites.md) doc to install `mpdev` tool.

make sure to replace this line `gcloud_original_path=(--env "GCLOUD_ORIGINAL_PATH=$(readlink -f ${GCLOUD_CONFIG})")` with this line `gcloud_original_path=(--env "GCLOUD_ORIGINAL_PATH=${GCLOUD_CONFIG}")` in the `mpdev` file.

Make sure `gke` cluster is created and `gcr` container registry is authenticated by follow this [doc](https://cloud.google.com/container-registry/docs/advanced-authentication)

Make sure `kubectl` is pointing to the newly created `gke` cluster.

## Application Install

Follow this [doc](https://github.com/GoogleCloudPlatform/marketplace-k8s-app-tools/blob/master/docs/building-deployer-helm.md) for better understading but need not create any files.
This following files are already in this repo

- [schemal.yaml](schema.yaml)
- [Dockerfile](Dockerfile)
- [applicatio.yaml](templates/application)

**To build the deployer container**

```console
# Set the registry to your project GCR repo.
export REGISTRY=gcr.io/$(gcloud config get-value project | tr ':' '/')
export APP_NAME=wordpress

docker build --tag $REGISTRY/$APP_NAME/deployer .
```

Push your built to the remote GCR so that your app running in your GKE cluster can access the image:

```console
docker push $REGISTRY/$APP_NAME/deployer
```

## Deployment

Create a new namespace to cleanly deploy your app:

clone [marketplace-k8s-app-tools](
https://github.com/GoogleCloudPlatform/marketplace-k8s-app-tools) repo

```console
git clone git@github.com:GoogleCloudPlatform/marketplace-k8s-app-tools.git

cd marketplace-k8s-app-tools

kubectl create namespace test-ns

mpdev scripts/install \
  --deployer=$REGISTRY/$APP_NAME/deployer \
  --parameters='{"name": "test-deployment", "namespace": "test-ns"}'
```

You can see your application in GKE UI by following this link:

```console
https://console.cloud.google.com/kubernetes/application?project=YOUR_PROJECT
```


All the code snipets and docs are copied from [marketplace-k8s-app-tools](
https://github.com/GoogleCloudPlatform/marketplace-k8s-app-tools)
