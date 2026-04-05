# Dockerfile — React/Vite (Multi-stage)
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

# Copy only package files first (better layer caching)
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the Vite application
RUN npm run build

# ─── Stage 2: Serve with nginx ──────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Copy custom nginx config for SPA routing
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
