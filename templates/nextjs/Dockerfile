# Dockerfile — Next.js (Multi-stage)
#
# Stages:
#   1. deps:    Install production dependencies only
#   2. builder: Build the Next.js application
#   3. runner:  Minimal production image with standalone output
#
# Requires: Next.js output set to "standalone" in next.config.ts:
#   const nextConfig = { output: "standalone" };
#
# Build:  docker build -t my-app .
# Run:    docker run -p 3000:3000 my-app

# ─── Stage 1: Install dependencies ──────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first (better layer caching)
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# ─── Stage 2: Build the application ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the Next.js application
# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ─── Stage 3: Production runner ─────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only the necessary files from the builder stage
# Next.js standalone output includes a minimal server and required node_modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose the default Next.js port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
