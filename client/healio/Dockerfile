# Multi-stage build for Next.js application

# Stage 1: Dependencies
FROM node:21.7.0-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm v9 and dependencies
RUN npm install -g pnpm@9 && pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:21.7.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm v9
RUN npm install -g pnpm@9

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Stage 3: Runtime
FROM node:21.7.0-alpine

WORKDIR /app

# Install pnpm v9
RUN npm install -g pnpm@9

# Create non-root user
RUN addgroup -S appuser && adduser -S appuser -G appuser

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --production

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Copy necessary files
COPY --from=builder /app/package.json ./package.json

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -q -O- http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://localhost:8080/v1

# Run Next.js application
CMD ["pnpm", "start"]
