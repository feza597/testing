# Build Stage
FROM node:20 AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build  
# Ensure this creates /app/build
# Debug step: Check if build folder exists
RUN ls -l /app
# Run Stage
FROM node:20
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist 
# Ensure this folder exists
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
