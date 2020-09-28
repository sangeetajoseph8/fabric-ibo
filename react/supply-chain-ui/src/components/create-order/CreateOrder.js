import React, { Component } from 'react'
import API from '../Api'
import EnterOrderDetails from "./EnterOrderDetails"
import UploadFiles from "./UploadFiles"
import EnterConnections from './EnterConnections'



const IPFS = require('ipfs-api')
const ipfs = new IPFS({
    host: 'localhost', port: 5001, protocol: 'http', headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    }
});


export default class CreateOrder extends Component {
    constructor() {
        super()
        this.state = {
            orderId: '',
            initiatorOrg: 'Customer',
            approverOrg: '',
            payload: '',
            comment: '',
            orderDate: new Date(),
            orderType: '',
            step: 1,
            fileBufferList: [],
            ipfsFileHash: [],
            ipfsFileName: []
        }

    }

    nextStep = () => {
        const { step } = this.state
        this.setState({
            step: step + 1
        })
    }

    prevStep = () => {
        const { step } = this.state
        this.setState({
            step: step - 1
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const data = {
            args: [this.state.orderId, this.state.initiatorOrg, this.state.approverOrg, this.state.payload, this.state.comment, this.state.orderDate]
        }

        console.log(data)
        API.createProductDetils("CREATE_ORDER", data, {
            callback: () => {
                console.log("Testing")
            }
        })
    }

    onFileChangeHandler = (event) => {
        this.setState({ ipfsFileName: this.state.ipfsFileName.concat([event.target.files[0].name]) })
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({ fileBufferList: this.state.fileBufferList.concat([reader.result]) })
            console.log('buffer', this.state.fileBufferList)
            console.log('DD', this.state)
        }
    }

    saveToIpfs = () => {
        this.state.fileBufferList.map(buffer => {
            console.log(buffer)
            ipfs.files.add(Buffer.from(buffer), (error, result) => {
                if (error) {
                    console.error('Error:', error)
                    return
                }
                console.log('ipfsFileHash', result[0].hash)
                this.setState({
                    ipfsFileHash: this.state.ipfsFileHash.concat([result[0].hash])
                })

                console.log(this.state.ipfsFileHash)
            })
        })
        console.log(this.state)
    }


    handleDateChange = (date) => {
        this.setState({
            orderDate: date
        });
    };


    render() {
        const { step } = this.state;
        const { orderId, initiatorOrg, approverOrg, payload, comment, ipfsFileHash, orderType, orderDate } = this.state;

        const values = { orderId, initiatorOrg, approverOrg, payload, comment, ipfsFileHash, orderType, orderDate };

        switch (step) {
            case 1: return <EnterOrderDetails
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                handleDateChange={this.handleDateChange}
                values={values} />
            case 2: return <UploadFiles
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                onFileChangeHandler={this.onFileChangeHandler}
                saveToIpfs={this.saveToIpfs}
                values={values} />
            case 3: return <EnterConnections
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                saveToIpfs={this.saveToIpfs}
                values={values} />
            default:
                return <div>Hi</div>

        }
    }
}
