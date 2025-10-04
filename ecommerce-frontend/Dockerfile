# Build stage
FROM node:18-alpine AS build
WORKDIR /ecom-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM node:18-alpine
WORKDIR /ecom-app
COPY --from=build /ecom-app ./
EXPOSE 3000
CMD ["npm", "start"]
