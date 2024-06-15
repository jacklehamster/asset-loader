async function bundle() {
  return await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    minify: true,
    sourcemap: "external",
    target: "browser",
  });
}

await bundle().then(result => {
  result?.logs.forEach((line, index) => console.log(index, line));
});

export {}
