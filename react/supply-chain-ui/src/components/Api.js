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

  createProductDetils(key, userData, options = {}) {
    const path = `/createOrderDetails`;
    const opt = Object.assign({}, options, { handle422: true });
    const data = {
      "args": ["000132", "Customer", "Manufacturer", "{\"selector\":{\"docType\":\"asset\",\"owner\":\"tom\"}}", "First Order"]
    }
    API.makePostRequest(path, key, userData, opt);
  },

  getProductDetails(key, orderId, options = {}) {
    const path = `/getOrderDetails/${orderId}`;
    API.makeGetRequest(path, key, '', options);
  },
};