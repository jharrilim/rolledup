class Foo extends React.Component {
    constructor(props) {
        super(props);
        this.name = 'foo bar bazzzzzzzzzzzzzzzzzzzz';
        // look, a window
        window.localStorage.setItem('yee', 'boiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
    }
    render() {
        const el = React.createElement('p', { key: this.name }, this.name);
        // localStorage???!?!?!?!?!?!
        const el2 = React.createElement('p', { key: 'yee' }, localStorage.getItem('yee'));
        return React.createElement('div', null, [el, el2]);
    }
}

ReactDOMServer.renderToStaticMarkup(React.createElement(Foo));
