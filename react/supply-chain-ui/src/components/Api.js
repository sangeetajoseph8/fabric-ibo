import API from './BaseApi';

export default {
  bookItem(key, data, options = {}) {
    const path = '/createItems.json';
    API.makePostRequest(path, key, data, options);
  },

  createUserDetails(key, userData, userId, options = {}) {
    const path = `/users/${userId}.json`;
    const opt = Object.assign({}, options, { handle422: true });
    API.makePutRequest(path, key, userData, opt);
  },

  getCartDetails(key, userId, options = {}) {
    const path = `/cart/${userId}`;
    API.makeGetRequest(path, key, { foo: 'bar' }, options);
  },

  registerUser(key, userData, options = {}) {
    const path = `/users`;
    const opt = Object.assign({}, options, { handle422: true });
    API.registerUserGetAuthToken(path, key, userData, opt);
  },

  createProductDetils(key, userData, options) {
    const path = `/createOrderDetails`;
    API.makePostRequest(path, key, userData, options);
  },

  getProductDetails(key, orderId, options = {}) {
    const path = `/getOrderDetails/${orderId}`;
    API.makeGetRequest(path, key, '', options);
  },

  getConnectionHistory(key, orderId, options) {
    const path = `/productHistory?orderId=${orderId}`;
    API.makeGetRequest(path, key, '', options);
  },

  createAccessRequestFromProductHistory(key, data, options) {
    const path = `/createAccessRequest`;
    API.makePostRequest(path, key, data, options);
  },

  checkIfAccessRequestExists(orderId, approvingOrgName, options) {
    const path = `/accessRequestExists?orderId=${orderId}&approvingOrgName=${approvingOrgName}`
    API.makeGetRequest(path, '', '', options);
  },

  getAccessRequestForRequestingOrg(options) {
    const path = `/getAccessRequestsForRequestingOrg`
    API.makeGetRequest(path, '', '', options);
  },

  getAccessRequestsForApprovingOrg(options) {
    const path = `/getAccessRequestsForApprovingOrg`
    API.makeGetRequest(path, '', '', options);
  },

  deleteAccessRequest(data, options) {
    const path = `/deleteAccessRequest`
    API.makePostRequest(path, '', data, options);
  }
};