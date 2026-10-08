# --- build: bundle the app into a single self-contained file ---
FROM node:22-slim AS build
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# --- runtime: ttyd + node + dist/main.js (no node_modules needed) ---
FROM node:22-slim
ADD https://github.com/tsl0922/ttyd/releases/download/1.7.7/ttyd.x86_64 /usr/local/bin/ttyd
RUN chmod +x /usr/local/bin/ttyd

WORKDIR /app
COPY --from=build /app/dist/main.js ./main.js
ENV NODE_ENV=production
# ttyd's image addon (enableSixel) can show real logo images; tell the app.
ENV PORTFOLIO_ICONS=image

EXPOSE 7681
# Each browser tab gets its own process; running the prebuilt bundle with
# plain node (instead of pnpm + tsx) makes a new session start ~4x faster.
CMD ["ttyd", "-W", "-p", "7681", \
     "-t", "titleFixed=Sao Visal · Portfolio", \
     "-t", "fontSize=15", \
     "-t", "enableSixel=true", \
     "-t", "disableLeaveAlert=true", \
     "-t", "disableResizeOverlay=true", \
     "-t", "theme={\"background\":\"#0d1117\"}", \
     "node", "main.js"]
