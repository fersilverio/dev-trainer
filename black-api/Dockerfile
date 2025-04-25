FROM node:22

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

#RUN npx prisma db push
RUN npx prisma generate

CMD ["npm", "run", "start:dev"]