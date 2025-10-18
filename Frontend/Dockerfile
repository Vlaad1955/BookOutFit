FROM node:22-bullseye

WORKDIR /app


COPY package*.json ./
RUN npm ci

ENV NEXT_PUBLIC_API_URL=http://backend:4000

EXPOSE 3000

CMD ["npm", "run", "dev"]
