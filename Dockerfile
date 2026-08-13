FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS build
WORKDIR /build
COPY .htmlvalidate.json index.html ./
RUN npx --yes html-validate@11.6.2 index.html \
  && npm install -g html-minifier-terser@7.2.0 --no-audit --no-fund \
  && html-minifier-terser index.html --collapse-whitespace --remove-comments --minify-css --output index.html \
  && node -e 'const z=require("zlib"),f=require("fs");const s=f.readFileSync("index.html");f.writeFileSync("index.html.br",z.brotliCompressSync(s,{params:{[z.constants.BROTLI_PARAM_QUALITY]:11}}));f.writeFileSync("index.html.gz",z.gzipSync(s,{level:9}));console.log("html:",s.length,"B br:",f.statSync("index.html.br").size,"B gz:",f.statSync("index.html.gz").size,"B");'

FROM fholzer/nginx-brotli:latest@sha256:b126c7cd3df9f6ed3d664e5f5b79273659b175070257a5da0711f734db64f592
COPY nginx.conf /etc/nginx/nginx.conf
COPY og.png /usr/share/nginx/html/og.png
COPY --from=build /build/index.html /build/index.html.br /build/index.html.gz /usr/share/nginx/html/
RUN mkdir -p /tmp/nginx && chown -R nginx:nginx /tmp/nginx
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
