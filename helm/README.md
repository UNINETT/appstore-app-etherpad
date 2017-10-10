# Attempt to deploy using HELM

You need to be logged in, you can get this from https://docs.ioudaas.no/access/.

Make sure you have kubed and kubectl.  You also need helm, which you can get from:
https://github.com/kubernetes/helm, there are binary downloads available.

Prerequirements:
- Application is deployed on quay.io, deploy yourself with Docker to avoid giving Quay full control over your GitHub account.
- You're standing in the `helm` folder of this repo, it's the folder this README.md file is in.

For more info on Quay, check [this awesome Quay documentation](../QUAY.md).

1. Log in to Dataporten

		kubed -name daas -api-server https://api.ioudaas.no -client-id c89ab13a-68c3-4468-b434-a4bd1c9d2c81 -issuer https://daas-ti.dataporten-api.no

2. Find the name of the tiller instance you'll be using

		bin/kubectl -n appstore-dep get pods | grep tiller | cut -d\  -f1

We'll assume you just found `tiller-1234567890-swagx`.

3. Set up port forwarding

		kubectl -n appstore-dep port-forward tiller-1234567890-swagx 44134:44134 &

4. Deploy this application

		export HELM_HOST=localhost:44134
		helm --namespace appstore-dep install etherpad

5. Find your application

		bin/kubectl -n appstore-dep get pods | grep m\$

It's probably the youngest one.  We'll assume your application's name is `swaggity-swagger-etherpad-1234567890-swagx`.

6. Port forward directly from the running Docker container

		kubectl -n appstore-dep port-forward swaggity-swagger-etherpad-1234567890-swagx 9001:9001

Sometimes the port is used, which you can see from the `Connection refused` messages.
Use a different port then.  Update Dataporten accordingly.

Congratulations!  You've now deployed an application all by yourself!
Wasn't this way easier than doing this by hand?
