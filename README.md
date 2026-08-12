# Joeri Kaiser, Portfolio

One self-contained `index.html`. No framework, no build step, no scripts, no web fonts.

## View it

Open `index.html` in a browser, or serve the directory with any static file server.

## Deploy

The site ships as a single nginx container. The `Dockerfile` validates the HTML, minifies it, and precompresses brotli and gzip copies at build time; nginx serves the smallest encoding the client accepts. The container runs as a non-root user with a healthcheck.

### Local

```sh
docker build -t waldemar .
docker run -p 8080:8080 waldemar
```

### Coolify

1. Application → Public Repository → this repo, build pack **Dockerfile**.
2. Ports Exposes: `8080`.
3. Remove any custom nginx configuration: the config is baked into the image.
4. Domains → add your domain, Proxy (Traefik), SSL on.

Served sizes: 11 KB identity, 4.1 KB gzip, 3.4 KB brotli.

## Checks

HTML validity is checked in CI with [html-validate](https://html-validate.org), and again inside the Docker build:

```sh
npx html-validate index.html
```
