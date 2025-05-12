FROM node:22

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

CMD ["sh", "-c","npx prisma generate && npm run start:dev"]