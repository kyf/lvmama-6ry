FROM docker.io/mhart/alpine-node

RUN mkdir /work

WORKDIR /work

EXPOSE 8089
CMD ["node", "runtime/app"]

ADD ./node_modules/ /work/node_modules/
ADD ./package.json /work/package.json
ADD ./runtime/ /work/runtime/
ADD ./dist/ /work/dist/

