# rolledup

## What is this

This is SSR that actually works with browser stuff, eg. `window`.

> Note: Currently this is just a proof-of-concept; actual implementation coming soon.

## Demo

The [index.js](./index.js) script reads the [demo.js](./examples/demo.js) React file and renders it into [demo.html](./examples/demo.html).

To try it,

```sh
$ npm i
$ node .
```

## CLI

Right now, this has to be pointed to a directory that contains an index.js React file.
The `index.js` file must contain a line for rendering static markup:

```jsx
ReactDOMServer.renderToStaticMarkup(<Foo />);
```

You can render it with:

```sh
rolledup ./path/to/src/dir
```