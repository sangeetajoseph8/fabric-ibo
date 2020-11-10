import React, { Component } from 'react'
import API from '../Api'
import IPFS from '../IPFS'
import EnterOrderDetails from "./EnterOrderDetails"
import UploadFiles from "./UploadFiles"
import EnterConnections from './EnterConnections'
import ReviewOrder from './ReviewOrder'

export default class CreateOrder extends Component {
    constructor() {
        super()
        this.state = {
            orderId: '',
            approverOrg: '',
            payload: '',
            comment: '',
            orderDate: new Date(),
            orderType: '',
            step: 1,
            fileBufferList: [],
            ipfsFiles: [],
            ipfsFilesWithHash: [],
            connectionList: [],
            connectionListUploadedToLedger: [],
            noOfFilesUploadedToIPFS: 0,
            noOfConnectionsSaved: 0,
            isLoadingActive: false,
            hasSuccessfullyCreatedOrder: true
        }

    }

    handleSubmit = () => {
        console.log(this.state)
        if (this.state.noOfFilesUploadedToIPFS === this.state.ipfsFiles.length &&
            this.state.noOfConnectionsSaved === this.state.connectionList.length) {
            const data = {
                orderId: this.state.orderId,
                approverOrgName: this.state.approverOrg,
                payload: this.state.payload,
                comment: this.state.comment,
                orderType: this.state.orderType,
                fileList: this.state.ipfsFilesWithHash,
                orderDate: this.state.orderDate,
                connectedOrderIds: this.state.connectionListUploadedToLedger
            }
            console.log(data)
            API.createProductDetils(data, (result) => {
                if (result) {
                    this.props.history.push({
                        pathname: '/orderDetails/' + this.state.orderId,
                        state: { orderId: this.state.orderId }
                    })
                } else {
                    this.setState({ hasSuccessfullyCreatedOrder: false })
                    //TODO: delete the connection 
                }
                this.setState({
                    isLoadingActive: false,
                    noOfConnectionsSaved: 0,
                    noOfFilesUploadedToIPFS: 0
                })
            })

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

    addToOrderListForConnection = (data) => {
        this.setState({ connectionList: this.state.connectionList.concat(data) })
        console.log(this.state.connectionList)
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        console.log(this.state)
    }

    onFileChangeHandler = (event) => {
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({
                ipfsFiles: this.state.ipfsFiles.concat({
                    buffer: reader.result,
                    name: file.name
                })
            })
            console.log('buffer', this.state.fileBufferList)
            console.log('DD', this.state)
        }
        event.target.value = null
    }

    saveConnections = () => {
        this.state.connectionList.map(item => {
            const data = {
                connectionId: Date.now() + '',
                productHistory1: {
                    orderDate: this.state.orderDate,
                    orderId: this.state.orderId,
                    orderType: this.state.orderType,
                },
                productHistory2: {
                    orderDate: item.orderDate,
                    orderId: item.orderId,
                    orderType: item.orderType,
                    orgName: item.initiatorOrgName
                }
            }
            console.log(data)
            API.createConnection(data, (result) => {
                this.setState(
                    { noOfConnectionsSaved: this.state.noOfConnectionsSaved + 1 }
                )
                if (result)
                    this.setState({ connectionListUploadedToLedger: this.state.connectionListUploadedToLedger.concat(item.orderId) })

                this.handleSubmit()
            })
        })
        this.handleSubmit()
    }

    saveToIpfs = () => {
        this.setState({ isLoadingActive: true })
        if (this.state.ipfsFiles.length === 0) {
            this.handleSubmit()
        } else {
            this.state.ipfsFiles.map(ipfsFile => {
                IPFS.saveToIpfs(ipfsFile.buffer, (ipfsHash) => {
                    this.setState(
                        { noOfFilesUploadedToIPFS: this.state.noOfFilesUploadedToIPFS + 1 }
                    )
                    console.log(ipfsHash)
                    if (ipfsHash) {
                        let file = {
                            name: ipfsFile.name,
                            hash: ipfsHash[0]
                        }
                        this.setState({ ipfsFilesWithHash: this.state.ipfsFilesWithHash.concat(file) })
                    }
                    this.handleSubmit()
                })
            })
        }
    }

    handleDateChange = (date) => {
        this.setState({
            orderDate: date
        });
    };


    render() {
        const { step } = this.state;
        const { orderId, approverOrg, payload, comment, ipfsFiles, orderType, orderDate, connectionList } = this.state;

        const values = { orderId, approverOrg, payload, comment, orderType, orderDate, ipfsFiles, connectionList };

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
                addToOrderListForConnection={this.addToOrderListForConnection}
                values={values} />
            case 4: return <ReviewOrder
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                saveToIpfs={this.saveToIpfs}
                isLoadingActive={this.state.isLoadingActive}
                hasSuccessfullyCreatedOrder={this.state.hasSuccessfullyCreatedOrder}
                saveConnections={this.saveConnections}
                values={values}
            />
            default:
                return <div></div>

        }
    }
}
