FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Local-friendly install
RUN npm install --legacy-peer-deps

COPY . .

# Vite dev server
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
