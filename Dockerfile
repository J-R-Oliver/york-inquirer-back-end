FROM node:current-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 9090
CMD [ "npm", "start" ]