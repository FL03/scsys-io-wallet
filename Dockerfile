ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS node-base

# Install dependencies only when needed
FROM node-base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./

# If you have native dependencies, you'll need extra tools

# Install all dependencies, including 'devDependencies'
RUN npm install

# Rebuild the source code only when needed
FROM node-base AS builder

ENV NEXT_PUBLIC_BUILD_OUTPUT_TYPE="standalone" \
    NEXT_TELEMETRY_DISABLED=1 \ 
    NODE_ENV=production
# Set working directory
WORKDIR /app

# Copy the source code  
ADD . .
# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# Production image, copy all the files and run next
FROM node-base AS runner-base

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1 \ 
    NODE_ENV=production

# Create a group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Set the correct permission for prerender cache
RUN mkdir .next &&\
    chown nextjs:nodejs .next &&\
    chmod 755 .next

# Copy the public folder
COPY --from=builder --chmod=755 --chown=nextjs:nodejs --link /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chmod=755 --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chmod=755 --chown=nextjs:nodejs /app/.next/static ./.next/static

FROM runner-base AS runner
# Set some environment variables
ENV NEXT_PUBLIC_SITE_URL="https://template-nextjs-dashboard.vercel.app" \
    NEXT_PUBLIC_SUPABASE_ANON_KEY="" \
    NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321" \
    SUPABASE_JWT_SECRET="" \
    SUPABASE_SERVICE_ROLE_KEY="" \
    POSTGRES_PASSWORD="" \
    HOSTNAME="0.0.0.0" \
    PORT=3000

    # Expose the port the app runs on
EXPOSE 3000

# Set the user to use when running this image
USER nextjs

# Start the application
CMD ["node", "server.js"]