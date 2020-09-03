class Foo extends React.Component {
    constructor(props) {
        super(props);
        this.name = 'foo bar bazzzzzzzzzzzzzzzzzzzz';
        window.localStorage.setItem('yee', 'boiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
    }
    render() {
        const el = React.createElement('p', null, this.name);

        return React.createElement('div', null, el);
    }
}

ReactDOMServer.renderToStaticMarkup(React.createElement(Foo));
