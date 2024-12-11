FROM ghcr.io/runatlantis/atlantis:latest

USER root

RUN apk add --no-cache aws-cli

RUN mkdir /home/atlantis/.aws
RUN touch /home/atlantis/.aws/credentials

RUN chown atlantis.atlantis /home/atlantis/ -R