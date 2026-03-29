# Dockerfile — Vue.js/Vite (Multi-stage)
#
# Stages:
#   1. builder: Install deps and build the Vite application
#   2. runner:  Serve static files with nginx
#
# Build:  docker build -t my-app .
# Run:    docker run -p 80:80 my-app

# ─── Stage 1: Build the application ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build

# ─── Stage 2: Serve with nginx ──────────────────────────────────────────────────
FROM nginx:alpine AS runner

COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
