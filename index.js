const vm = require('vm');
const fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { JSDOM } = require('jsdom');
const { join } = require('path');
const Babel = require('@babel/core');
const presetReact = require('@babel/preset-react').default;

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

const demo = () => {
  const demoStr = fs.readFileSync(join(__dirname, 'demo.js'));
  const dom = newDom();
  const ctx = newCtx(dom.window)(demoStr);

  dom.window.document.getElementById('vssr-root').innerHTML = ctx;
  fs.writeFileSync(join(__dirname, 'demo.html'), dom.serialize());
}

function jsxDemo() {
  const { code } = Babel.transformSync(
    fs.readFileSync(join(__dirname, 'jsxdemo.jsx')),
    {
      presets: [
        presetReact
      ]
    }
  );
  const dom = newDom();
  const ctx = newCtx(dom.window)(code);
  dom.window.document.getElementById('vssr-root').innerHTML = ctx;
  fs.writeFileSync(join(__dirname, 'jsxdemo.html'), dom.serialize());
}


// demo();
jsxDemo();


