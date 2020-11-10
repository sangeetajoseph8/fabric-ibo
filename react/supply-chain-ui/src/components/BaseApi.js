import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

export default {

    registerUserGetAuthToken(path, body, options = {}) {
        axiosInstance.post(path, body).then(res => {
            console.log(res)
            if (res.data.success === true) {
                localStorage.setItem('authToken', res.data.token)
                localStorage.setItem('username', body.username)
                localStorage.setItem('orgName', body.orgName)
                options(res.data.token)
            } else {
                options(null)
            }


        }).catch((err) => {
            console.log(err)
            options(null)
        });
    },

    makePostRequest(path, body, options = {}) {
        axiosInstance.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('authToken', "");
        axiosInstance.post(path, body).then(res => {
            console.log(res)
            options(res.data.result)
        }).catch((err) => {
            console.log(err)
            options(null)
        });
    },

    makeGetRequest(path, body, options) {
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
