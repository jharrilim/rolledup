const vm = require('vm');
const fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { JSDOM } = require('jsdom');
const { join } = require('path');

const demoStr = fs.readFileSync(join(__dirname, 'demo.js'));

const dom = new JSDOM(undefined, {
    url: 'http://localhost',
});
const root = dom.window.document.createElement('div');

root.id = 'vssr-root';
dom.window.document.body.appendChild(root);

const ctx = vm.runInNewContext(`
${demoStr}
`,
    {
        window: dom.window,
        ReactDOMServer,
        React,
    },
    {
        filename: 'vssr-generated.js',
    }
);

root.innerHTML = ctx;

fs.writeFileSync(join(__dirname, 'demo.html'), dom.serialize());
