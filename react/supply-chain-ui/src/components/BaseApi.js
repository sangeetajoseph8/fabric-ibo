import React from 'react'
import axios from 'axios'


const NO_CONTENT = 204;
const UNAUTHORIZED = 401;

const accessToken = ''

const url = "http://localhost:4000"

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

export default {

    registerUserGetAuthToken(path, key, body, options = {}) {
        axiosInstance.post(path, body).then(res => {
            console.log(res.data.token)
            localStorage.setItem('authToken', res.data.token)
        }).catch((err) => {
            console.log(err)
        });
    },

    makePostRequest(path, key, body, options = {}) {
        axiosInstance.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('authToken', "");
        axiosInstance.post(path, body).then(res => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        });
    },

    makeGetRequest(path, key, body, options = {}) {
        axiosInstance.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('authToken', "");
        axiosInstance.get(path, body).then(res => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        });
    }

};
