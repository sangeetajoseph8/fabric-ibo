import React from 'react';
import './App.css';
import RegisterUser from './components/RegisterUser';
import CreateOrder from './components/create-order/CreateOrder';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import ProductHistory from './components/product-history/ProductHistory';
import AccessRequestList from './components/access-request/AccessRequestList'
import AccessRequestDetails from './components/access-request/AccessRequestDetails'
import AccessRequestToApproveList from './components/access-request-to-approve/AccessRequestToApproveList';

function App() {
  return (
    <div className="App">

      <Switch>
        <Route exact path="/" component={RegisterUser}></Route>
        <Route path="/createOrder" component={CreateOrder}></Route>
        <Route path="/productHistory" component={ProductHistory}></Route>
        <Route path="/accessRequestList" component={AccessRequestList}></Route>
        <Route path="/accessRequestDetails" component={AccessRequestDetails}></Route>
        <Route path="/accessRequestToApproveList" component={AccessRequestToApproveList}></Route>
      </Switch>
      <BrowserRouter>
        <Link to='/createOrder'>Click</Link>
        <Link to='/productHistory'>Click 2</Link>
        <Link to='/accessRequestList'>Click 3</Link>
        <Link to='/accessRequestToApproveList'>Click 4</Link>

      </BrowserRouter>

    </div>
  );
}

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);


export default App;
