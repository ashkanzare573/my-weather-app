FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["sh", "-c", "echo 'Open http://127.0.0.1:5173/ in your browser'; npm run dev -- --host 0.0.0.0"]