import API from './BaseApi';

export default {
  registerUser(userData, options = {}) {
    const path = `/users`;
    API.registerUserGetAuthToken(path, userData, options);
  },

  createProductDetils(userData, options) {
    const path = `/createOrderDetails`;
    API.makePostRequest(path, userData, options);
  },

  getProductDetails(orderId, options = {}) {
    const path = `/orderDetailsByOrderId?orderId=${orderId}`;
    API.makeGetRequest(path, '', options);
  },

  getAllCreatedOrders(options = {}) {
    const path = `/getAllcreatedOrders`;
    API.makeGetRequest(path, '', options);
  },

  deleteOrderDetails(data, options) {
    const path = `/deleteOrderDetails`
    API.makePostRequest(path, data, options);
  },

  updateOrderStatus(data, options) {
    const path = `/updateOrderDetailsStatus`
    API.makePostRequest(path, data, options);
  },

  createConnection(data, options) {
    const path = `/createProductHistoryConnection`
    API.makePostRequest(path, data, options)
  },

  getConnectionHistory(key, orderId, options) {
    const path = `/productHistory?orderId=${orderId}`;
    API.makeGetRequest(path, '', options);
  },

  createAccessRequestFromProductHistory(key, data, options) {
    const path = `/createAccessRequest`;
    API.makePostRequest(path, data, options);
  },

  checkIfAccessRequestExists(orderId, approvingOrgName, options) {
    const path = `/accessRequestExists?orderId=${orderId}&approvingOrgName=${approvingOrgName}`
    API.makeGetRequest(path, '', options);
  },

  getAccessRequestForRequestingOrg(options) {
    const path = `/getAccessRequestsForRequestingOrg`
    API.makeGetRequest(path, '', options);
  },

  getAccessRequestsForApprovingOrg(options) {
    const path = `/getAccessRequestsForApprovingOrg`
    API.makeGetRequest(path, '', options);
  },

  deleteAccessRequest(data, options) {
    const path = `/deleteAccessRequest`
    API.makePostRequest(path, data, options);
  }
};