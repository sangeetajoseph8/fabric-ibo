import React from 'react';
import logo from './logo.svg';
import './App.css';
import RegisterUser from './components/RegisterUser';
import CreateOrder from './components/create-order/CreateOrder';
import { BrowserRouter, Route, Link, Router, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Link exact to='/createOrder'>Click</Link>
        <Route exact path="/" component={RegisterUser}></Route>
        <Route exact path="/createOrder" component={CreateOrder}></Route>
      </BrowserRouter>

    </div>
  );
}

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);


export default App;
