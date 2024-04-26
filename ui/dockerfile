FROM node:14-alpine

LABEL org.opencontainers.image.source = "https://github.com/r-dvl/portfolio"
LABEL org.opencontainers.image.description "R-dVL's portfolio"

# React ENV Vars
ARG REACT_APP_TELEGRAM_BOT_TOKEN
ENV REACT_APP_TELEGRAM_BOT_TOKEN $REACT_APP_TELEGRAM_BOT_TOKEN

ARG REACT_APP_TELEGRAM_CHAT_ID
ENV REACT_APP_TELEGRAM_CHAT_ID $REACT_APP_TELEGRAM_CHAT_ID


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build"]