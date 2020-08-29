FROM node:12-alpine

WORKDIR /usr/src/app
COPY . .

RUN npm install --production
# Differentiate environments that use agones
ENV AGONES=1
# Mark as production service
ENV IS_PRODUCTION=1
# This allows us to run kubectl commands within the cluster
COPY --from=lachlanevenson/k8s-kubectl:latest /usr/local/bin/kubectl /usr/local/bin/kubectl

EXPOSE 3000
CMD [ "npm", "start" ]
