FROM node:20.11-slim

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy TypeScript config
COPY tsconfig.json ./

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN pnpm run build

# Add healthcheck
HEALTHCHECK --interval=5m --timeout=30s --start-period=5s --retries=3 \
  CMD pgrep -f "node" || exit 1

# Start the scheduler
CMD ["pnpm", "run", "scheduler"] 