import Title from './title';

class Foo extends React.Component {
  constructor(props) {
    super(props);
    localStorage.setItem('count', 'Uno Dos Tres Cuatro');
  }

  render() {
    return (
      <div>
        <Title />
        <h2>Dale</h2>
        <h3>{localStorage.getItem('count') || '305'}</h3>
      </div>
    );
  }
}
export default Foo;
