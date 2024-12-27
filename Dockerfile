FROM node:23.5-slim
ENV NODE_ENV=production

COPY .output/ /www
WORKDIR /www
EXPOSE 3000
ENTRYPOINT ["node", "server/index.mjs"]

