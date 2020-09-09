import vm from 'vm';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { JSDOM, DOMWindow } from 'jsdom';
import { join } from 'path';
import Babel from '@babel/core';
import presetReact from '@babel/preset-react';
import { rollup } from 'rollup';
import babelRollupPlugin from '@rollup/plugin-babel';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';
import meow from 'meow';

const rootId = 'rolledup-root';

const newDom = () => {
  const dom = new JSDOM(undefined, {
    url: 'http://localhost',
  });
  const root = dom.window.document.createElement('div');
  root.id = rootId;
  dom.window.document.body.appendChild(root);
  return dom;
}

const newCtx = (window: Window | DOMWindow) => (code: string) => vm.runInNewContext(code, {
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
  const demoStr = fs.readFileSync(join(exampleDir, 'demo.js')).toString();
  const dom = newDom();
  const ctx = newCtx(dom.window)(demoStr);

  dom.window.document.getElementById(rootId)!.innerHTML = ctx;
  fs.writeFileSync(join(exampleDir, 'demo.html'), dom.serialize());
};

const jsxDemo = () => {
  const { code } = Babel.transformSync(
    fs.readFileSync(join(exampleDir, 'jsxdemo.jsx')).toString(),
    {
      presets: [
        presetReact
      ]
    }
  )!;
  const dom = newDom();
  const ctx = newCtx(dom.window)(code!);
  dom.window.document.getElementById(rootId)!.innerHTML = ctx;
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
  dom.window.document.getElementById(rootId)!.innerHTML = ctx;
  fs.writeFileSync(outputFilePath, dom.serialize());
};

const build = async (path: string) => {
  const build = await rollup({
    input: join(path, 'index.js'),
    plugins: [
      nodeResolvePlugin({
        extensions: ['jsx', 'js'],
      }),
      babelRollupPlugin({
        babelHelpers: 'bundled',
        cwd: path,
        extensions: ['jsx', 'js'],
      }),
    ]
  });

  const { output: [{ code }] } = await build.generate({
    dir: join(path, 'dist'),
    format: 'cjs',
  });

  const dom = newDom();
  const ctx = newCtx(dom.window)(code);
  dom.window.document.getElementById(rootId)!.innerHTML = ctx;
  
  const outputFilePath = join(path, 'dist', 'index.html');
  fs.writeFileSync(outputFilePath, dom.serialize());
}

// rollupDemo();

export const main = () => {
  const { input, flags } = meow(`
    Description
    Pre-renders your JSX code.
    Usage
    $ rolledup <input>
    Examples
    $ rolledup .
  `.replace('    ', '  '), {});

  const cwd = input[0] ?? process.cwd();
  build(cwd);

}

if (__filename === require.main?.filename) {
  main();
}
