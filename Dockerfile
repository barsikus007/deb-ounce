FROM oven/bun:alpine as installer
ARG USER=bun

USER $USER
WORKDIR /app

# docker init's Dockerfile description for pnpm install command
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.local/share/pnpm/store to speed up subsequent builds.
# Leverage a bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

COPY --chown=$USER package.json bun.lockb index.html .eslintrc.cjs .eslintignore vite.config.ts tsconfig.json ./


FROM installer as development

EXPOSE 3000
CMD ["bun", "dev", "--host"]


FROM installer as builder

COPY src/ src/
RUN bun run build


FROM nginx:stable-alpine as serve

COPY --from=builder /app/dist/ /usr/share/nginx/html/
# hadolint ignore=SC2016
RUN echo 'server{listen 80;listen [::]:80;server_name boilerplate;location /{root /usr/share/nginx/html;try_files $uri /index.html;}}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
