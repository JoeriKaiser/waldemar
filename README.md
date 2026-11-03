# Joeri Kaiser, Portfolio

One self-contained `index.html`. No framework, no client-side scripts, no web fonts. The Docker build validates it, minifies it, and writes Brotli and gzip copies for nginx to serve.

`index.md` is the same content in Markdown, served at `/index.md` and to clients that send `Accept: text/markdown`. Edit both files together.

After changing the hero, regenerate the social preview with `bun og.mjs`.

Live at [waldemar.site](https://waldemar.site).
