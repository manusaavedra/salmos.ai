import './App.css'
import { Route, Switch } from 'wouter'
import Slave from './pages/Slave.js';
import Master from './pages/Master.js';

function App() {

  return (
    <Switch>
      <Route path='/' component={Master} />
      <Route path='/client' component={Slave} />
    </Switch>
  )
}

export default App;
