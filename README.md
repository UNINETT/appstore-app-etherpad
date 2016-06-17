# ep_dataporten

If used without Docker, add this to settings.json:

```
ep_dataporten:{
  clientId    : "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  host        : "YOUR_REDIRECT_URI"
}
```

If used with Docker, pull the image from

```$ docker pull uninettno/ep_dataporten```

Run it with:

```$ docker run -p 80:9001 --env-file=YOUR_ENV_FILE -t uninettno/ep_dataporten```

The ENV file should look something like this:

```ETHERPAD_DB_HOST=DB_HOSTNAME
ETHERPAD_DB_USER=DB_USERNAME
ETHERPAD_DB_PASSWORD=DB_PASSWORD
ETHERPAD_DB_NAME=DB_NAME

HOST=localhost/dataporten/callback  #Don't add http:// here, TLS takes care of this.
TLS=false
DATAPORTEN_CLIENTID=********-****-****-****-************
DATAPORTEN_CLIENTSECRET=********-****-****-****-************
DATAPORTEN_SCOPES=groups,userid,profile,userid-feide,email
MYSQL_PORT_3306_TCP_ADDR=3306```
