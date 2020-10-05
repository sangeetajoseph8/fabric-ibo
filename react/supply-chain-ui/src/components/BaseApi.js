import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

export default {

    registerUserGetAuthToken(path, key, body, options = {}) {
        axiosInstance.post(path, body).then(res => {
            console.log(res)
            localStorage.setItem('authToken', res.data.token)
        }).catch((err) => {
            console.log(err)
        });
    },

    makePostRequest(path, key, body, options = {}) {
        axiosInstance.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('authToken', "");
        axiosInstance.post(path, body).then(res => {
            console.log(res)
            options(res.data.result)
        }).catch((err) => {
            console.log(err)
            options(null)
        });
    },

    makeGetRequest(path, key, body, options) {
        axiosInstance.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('authToken', "");
        axiosInstance.get(path, body).then(res => {
            console.log(res.data.result)
            options(res.data.result)
        }).catch((err) => {
            console.log(err)
            options(null)
        });
    }

};
