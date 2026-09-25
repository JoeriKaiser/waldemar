FROM node:26-alpine@sha256:2d984a15c9b54fd0aeb608b8e0d0d83529eb34d2966db27a1fb4f1edc3d298a3 AS build
WORKDIR /build
COPY .htmlvalidate.json index.html index.md robots.txt sitemap.xml llms.txt favicon.svg ./
RUN npx --yes html-validate@11.6.2 index.html \
  && npm install -g html-minifier-terser@7.2.0 --no-audit --no-fund \
  && html-minifier-terser index.html --collapse-whitespace --remove-comments --minify-css --output index.html \
  && node -e 'const z=require("zlib"),f=require("fs");for(const file of ["index.html","index.md","favicon.svg"]){const s=f.readFileSync(file);f.writeFileSync(file+".br",z.brotliCompressSync(s,{params:{[z.constants.BROTLI_PARAM_QUALITY]:11}}));f.writeFileSync(file+".gz",z.gzipSync(s,{level:9}));console.log(file,":",s.length,"B br:",f.statSync(file+".br").size,"B gz:",f.statSync(file+".gz").size,"B");}'

FROM fholzer/nginx-brotli:latest@sha256:badd11084e3e39ce951107ae5ce3f59311f2dd457720d2dc332b614a1c7231fd
COPY nginx.conf /etc/nginx/nginx.conf
COPY og.png /usr/share/nginx/html/og.png
COPY --from=build /build/index.html /build/index.html.br /build/index.html.gz /usr/share/nginx/html/
COPY --from=build /build/index.md /build/index.md.br /build/index.md.gz /usr/share/nginx/html/
COPY --from=build /build/robots.txt /build/sitemap.xml /build/llms.txt /build/favicon.svg /build/favicon.svg.br /build/favicon.svg.gz /usr/share/nginx/html/
RUN mkdir -p /tmp/nginx && chown -R nginx:nginx /tmp/nginx
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
