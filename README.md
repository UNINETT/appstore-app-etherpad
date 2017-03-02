# ep_dataporten

This plugin implements https://github.com/UNINETT/passport-dataporten, and is a further development on https://github.com/andreassolberg/ep_feideconnect

If used without Docker, add this to settings.json:

```
ep_dataporten:{
  clientId    : "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  host        : "YOUR_REDIRECT_URI"
}
```

And move the ep_dataporten folder to etherpad/node_modules/

If used with Docker, pull the image from

```
docker pull uninettno/ep_dataporten
```

Run it with:

```
docker run -p 80:9001 --env-file=YOUR_ENV_FILE -t uninettno/ep_dataporten
```

**IMPORTANT**

On Dataporten Dashboard, set callback-url to URL + /dataporten/callback

The ENV file should look something like this:

```
ETHERPAD_DB_HOST=DB_HOSTNAME
ETHERPAD_DB_USER=DB_USERNAME
ETHERPAD_DB_PASSWORD=DB_PASSWORD
ETHERPAD_DB_NAME=DB_NAME
HOST=localhost  #Don't add http:// here, TLS takes care of this.
TLS=false
DATAPORTEN_CLIENTID=********-****-****-****-************
DATAPORTEN_CLIENTSECRET=********-****-****-****-************
DATAPORTEN_SCOPES=groups,userid,profile,userid-feide,email
MYSQL_PORT_3306_TCP_ADDR=3306
```

```
kubectl apply -f k8s.yaml
gcloud compute firewall-rules create service-etherpad --allow=tcp:31567
```
