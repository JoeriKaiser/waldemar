# Joeri Kaiser, Portfolio

One self-contained `index.html`. No framework, no build step, no scripts, no web fonts.

## View it

Open `index.html` in a browser, or serve the directory with any static file server.

## Deploy

Static hosting only. The single file is deployed to a VPS with Coolify.

## Checks

HTML validity is checked in CI with [html-validate](https://html-validate.org):

```sh
npx html-validate index.html
```
