# Joeri Kaiser, Portfolio

One self-contained `index.html`, plus an `og.png` social card. No framework, no build step, no scripts, no web fonts.

## View it

Open `index.html` in a browser, or serve the directory with any static file server.

## Deploy

The site ships as a single nginx container. The `Dockerfile` validates the HTML, minifies it, and precompresses brotli and gzip copies at build time; nginx serves the smallest encoding the client accepts. The container runs as a non-root user with a healthcheck. Base images are pinned by digest and build tools by exact version; Dependabot proposes bumps as pull requests.

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

Served sizes (as of 2026-08): 15.9 KB identity, 5.2 KB gzip, 4.3 KB brotli.

## Checks

CI (`.github/workflows/check.yml`) runs on push and PR:

- validates `index.html` with [html-validate](https://html-validate.org) (also enforced inside the Docker build)
- builds the Docker image, boots it, and smoke-tests it: the page serves, `og.png` serves, brotli precompression is used, and `index.html.br` stays under 6 KB

To validate locally:

```sh
npx html-validate index.html
```
