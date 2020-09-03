const { useEffect, useCallback } = React;

const DemoApp = () => {

  const wheelies = useCallback(() => {
    console.debug('360 WhEeL');
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', wheelies);
    return () => window.removeEventListener('wheel', wheelies);
  });

  return (
    <div>
      <div>Hello Moto</div>
      <h1>M o t o r o</h1>
    </div>
  );
}

ReactDOMServer.renderToStaticMarkup(<DemoApp />);