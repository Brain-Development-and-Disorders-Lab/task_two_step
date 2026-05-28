'use strict';

const esbuild = require('esbuild');
const consola = require('consola');
const fs = require('fs');

const [, , mode] = process.argv;

// Shared options for all modes
const baseConfig = {
  bundle: true,
  platform: 'browser',
  target: 'es2020',
};

// Watch and serve with live reload via ESBuild's SSE endpoint
async function dev() {
  fs.mkdirSync('dist', { recursive: true });
  fs.cpSync('src/stimuli', 'dist/stimuli', { recursive: true });

  // Inject the live-reload listener, all other tags are static in src/index.html
  const html = fs.readFileSync('src/index.html', 'utf-8').replace(
    '</body>',
    `  <script>new EventSource('/esbuild').addEventListener('change', () => location.reload())</script>\n</body>`
  );
  fs.writeFileSync('dist/index.html', html);

  const ctx = await esbuild.context({
    ...baseConfig,
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    sourcemap: true,
  });

  await ctx.watch();
  const { port } = await ctx.serve({ servedir: 'dist', port: 8080 });
  consola.info(`Development server: http://localhost:${port}`);
}

// Minified production build into dist/
async function build() {
  fs.rmSync('dist', { recursive: true, force: true });
  fs.mkdirSync('dist/stimuli', { recursive: true });
  fs.cpSync('src/stimuli', 'dist/stimuli', { recursive: true });
  fs.copyFileSync('src/index.html', 'dist/index.html');

  await esbuild.build({
    ...baseConfig,
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    minify: true,
  });

  consola.success('Build complete');
}

// Dev server for Playwright automated tests on port 9999
async function test() {
  const outdir = 'tests/automated/dist';
  fs.mkdirSync(outdir, { recursive: true });
  fs.copyFileSync('tests/automated/index.html', `${outdir}/index.html`);

  const ctx = await esbuild.context({
    ...baseConfig,
    entryPoints: ['tests/automated/index.ts'],
    outfile: `${outdir}/test-bundle.js`,
    sourcemap: 'inline',
  });

  await ctx.watch();
  const { port } = await ctx.serve({
    servedir: outdir,
    port: 9999,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
  consola.info(`Test server: http://localhost:${port}`);
}

const modes = { dev, build, test };
const run = modes[mode];
if (!run) {
  consola.error(`Unknown mode: ${mode}. Use: dev | build | test`);
  process.exit(1);
}

run().catch(err => {
  consola.error(err);
  process.exit(1);
});
