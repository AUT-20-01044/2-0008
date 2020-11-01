FROM node:12

WORKDIR /app

COPY . ./

RUN npm install

RUN cd 2-0010/ && npm install

EXPOSE 3600

CMD [ "npm", "start"]