import React from 'react';
import './App.css';
import RegisterUser from './components/RegisterUser';
import CreateOrder from './components/create-order/CreateOrder';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProductHistory from './components/product-history/ProductHistory';
import AccessRequestList from './components/access-request/AccessRequestList'
import AccessRequestDetails from './components/access-request/AccessRequestDetails'
import AccessRequestToApproveList from './components/access-request-to-approve/AccessRequestToApproveList';
import Menu from './components/AppMenu'
import ViewOrderDetails from './components/view-order/ViewOrderDetails';
import CreatedOrderList from './components/view-order/CreatedOrderList';
import TaggedOrderList from './components/view-order/TaggedOrderList';
import ApprovalOrderList from './components/view-order/ApprovalOrderList';

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Menu />
        <Switch>
          <Route exact path="/" component={RegisterUser}></Route>
          <Route path="/createOrder" component={CreateOrder}></Route>
          <Route path="/productHistory" component={ProductHistory}></Route>
          <Route path="/accessRequestList" component={AccessRequestList}></Route>
          <Route path="/accessRequestDetails" component={AccessRequestDetails}></Route>
          <Route path="/accessRequestToApproveList" component={AccessRequestToApproveList}></Route>
          <Route path="/orderDetails/:orderId" component={ViewOrderDetails}></Route>
          <Route path="/createdOrderList" component={CreatedOrderList}></Route>
          <Route path="/taggedOrderList" component={TaggedOrderList}></Route>
          <Route path="/approveOrderList" component={ApprovalOrderList}></Route>
        </Switch>

      </BrowserRouter>

    </div >
  );
}

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);


export default App;
