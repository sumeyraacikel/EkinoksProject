FROM ubuntu:latest
LABEL authors="smeyr"

ENTRYPOINT ["top", "-b"]
