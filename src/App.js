import './App.css';
import Plot from './Plot';
import NavBar from './NavBar';
import Home from './Home';
import { BrowserRouter, Switch, Route } from 'react-router-dom/cjs/react-router-dom.min';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path='/NASDX'>
            <Plot symbol='NASDX'/>
          </Route>
          <Route exact path='/VASGX'>
            <Plot symbol='VASGX'/>
          </Route>
          <Route exact path='/BITCF'>
            <Plot symbol='BITCF'/>
          </Route>
          <Route exact path='/RRGB'>
            <Plot symbol='RRGB'/>
          </Route>
          <Route exact path='/OGHCX'>
            <Plot symbol='OGHCX'/>
          </Route>
          <Route exact path='/'>
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    
    </div>
  );
}

export default App;
