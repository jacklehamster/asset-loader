import Bao from "baojs";
import serveStatic from "serve-static-bun";

const app = new Bao();

app.get("/*any", serveStatic("/../docs", { middlewareMode: "bao" }));

const server = app.listen({ port: 3000 });
console.log(`Listening on http://localhost:${server.port}`);


import lightningcss from 'bun-lightningcss'

await Bun.build({
  entrypoints: ['./src/index.tsx'],
  outdir: './dist',
  plugins: [lightningcss()],
})
