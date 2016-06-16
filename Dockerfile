FROM node:4-wheezy
MAINTAINER Kasper Rynning-Tønnesen <kasper@kasperrt.no>

ENV ETHERPAD_VERSION 1.6.0
RUN apt-get update && \
    apt-get install -y curl unzip mysql-client && \
    rm -r /var/lib/apt/lists/*

WORKDIR /opt/

RUN curl -SL \
    https://github.com/ether/etherpad-lite/archive/${ETHERPAD_VERSION}.zip \
    > etherpad.zip && unzip etherpad && rm etherpad.zip && \
    mv etherpad-lite-${ETHERPAD_VERSION} etherpad-lite
WORKDIR etherpad-lite

RUN bin/installDeps.sh && rm settings.json
COPY entrypoint.sh /entrypoint.sh

RUN sed -i 's/^node/exec\ node/' bin/run.sh

VOLUME /opt/etherpad-lite/var
RUN ln -s var/settings.json settings.json
COPY ep_dataporten node_modules/ep_dataporten
RUN cd node_modules/ep_dataporten && npm install

EXPOSE 9001

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bin/run.sh", "--root"]
