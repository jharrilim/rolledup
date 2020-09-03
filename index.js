const vm = require('vm');
const fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { JSDOM } = require('jsdom');
const { join } = require('path');
const Babel = require('@babel/core');
const presetReact = require('@babel/preset-react').default;
const { rollup } = require('rollup');
const babelRollupPlugin = require('@rollup/plugin-babel').default;
const nodeResolvePlugin = require('@rollup/plugin-node-resolve').default;
const newDom = () => {
  const dom = new JSDOM(undefined, {
    url: 'http://localhost',
  });
  const root = dom.window.document.createElement('div');
  root.id = 'vssr-root';
  dom.window.document.body.appendChild(root);
  return dom;
}

const newCtx = window => code => vm.runInNewContext(code, {
  ...window,
  window,
  globalThis: window,
  ReactDOMServer,
  React,
}, {
  filename: 'vssr-generated.js',
});

const exampleDir = join(__dirname, 'examples');

const demo = () => {
  const demoStr = fs.readFileSync(join(exampleDir, 'demo.js'));
  const dom = newDom();
  const ctx = newCtx(dom.window)(demoStr);

  dom.window.document.getElementById('vssr-root').innerHTML = ctx;
  fs.writeFileSync(join(exampleDir, 'demo.html'), dom.serialize());
};

const jsxDemo = () => {
  const { code } = Babel.transformSync(
    fs.readFileSync(join(exampleDir, 'jsxdemo.jsx')),
    {
      presets: [
        presetReact
      ]
    }
  );
  const dom = newDom();
  const ctx = newCtx(dom.window)(code);
  dom.window.document.getElementById('vssr-root').innerHTML = ctx;
  fs.writeFileSync(join(exampleDir, 'jsxdemo.html'), dom.serialize());
};

const rollupDemo = async () => {
  const proj = join(exampleDir, 'proj');
  const outputFilePath = join(proj, 'dist', 'index.html');

  const build = await rollup({
    input: join(proj, 'index.js'),
    plugins: [
      nodeResolvePlugin({
        extensions: ['jsx', 'js'],
      }),
      babelRollupPlugin({
        babelHelpers: 'bundled',
        cwd: proj,
        extensions: ['jsx', 'js'],
      }),
    ]
  });

  const { output: [{ code }] } = await build.generate({
    dir: join(proj, 'dist'),
    format: 'cjs',
  });

  const dom = newDom();
  const ctx = newCtx(dom.window)(code);
  dom.window.document.getElementById('vssr-root').innerHTML = ctx;
  fs.writeFileSync(outputFilePath, dom.serialize());
};


// demo();
// jsxDemo();

rollupDemo()
  .catch(console.error);
