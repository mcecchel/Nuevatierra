# Build stage: compile the Angular app with Node.js
FROM node:24-alpine AS build
WORKDIR /src

# Install dependencies first: this layer stays cached until the package files change
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# Runtime stage: nginx serves the compiled app and forwards backend calls
FROM nginx:1.30-alpine AS runtime
COPY gateway/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist/game-explorer/browser /usr/share/nginx/html
EXPOSE 80
