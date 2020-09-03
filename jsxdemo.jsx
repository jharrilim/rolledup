
const DemoApp = () => {
  return (
    <div>
      <div>Hello Moto</div>
      <h1>M o t o r o</h1>
    </div>
  );
}

ReactDOMServer.renderToStaticMarkup(<DemoApp />);