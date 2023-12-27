FROM node:18.14.0-slim

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .
RUN yarn install

EXPOSE 3000

CMD [ "yarn", "run", "start" ]
