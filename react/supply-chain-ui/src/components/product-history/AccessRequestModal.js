import React, { Component } from 'react'
import { Button, Form, Modal, Dimmer, Loader } from 'semantic-ui-react'
import API from '../Api'

export default class AccessRequestModal extends Component {
    constructor() {
        super()
        this.state = {
            open: false,
            comment: "",
            showAccessRequestForm: true,
            createAccessRequestStatus: false,
            doesRequestAlredayExists: false,
            isLoadingActive: false
        }
    }

    componentDidMount() {
        API.checkIfAccessRequestExists(this.props.orderId, this.props.orgName, (data) => {
            this.setState({ doesRequestAlredayExists: data })
            if (data) {
                this.setState({ showAccessRequestForm: false })
            } else {
                this.setState({ showAccessRequestForm: true })
            }
        })


    }

    setOpen = (value) => {
        this.setState({
            open: value
        })
    }

    handleChange = (event) => {
        this.setState({ comment: event.target.value })
    }

    requestAccess = () => {
        this.setState({ isLoadingActive: true })
        var data = {
            accessRequestId: "AR_" + new Date().valueOf(),
            commentFromRequestingOrg: this.state.comment,
            orderId: this.props.orderId,
            approvingOrgName: this.props.orgName
        }
        console.log(data)
        API.createAccessRequestFromProductHistory("ACCRESS_REQUEST", data, (response) => {
            if (response != null) {
                this.setState({ createAccessRequestStatus: true, showAccessRequestForm: false })
            } else {
                this.setState({ createAccessRequestStatus: false, showAccessRequestForm: false })
            }
            this.setState({ isLoadingActive: false })
        })
    }

    render() {
        return (
            <Modal
                onClose={() => this.setOpen(false)}
                onOpen={() => this.setOpen(true)}
                open={this.state.open}
                trigger={<Button color='teal'>Request Access</Button>} >
                {this.state.isLoadingActive ?
                    <Dimmer active inverted>
                        <Loader inverted content='Loading' />
                    </Dimmer> : null}
                { this.state.showAccessRequestForm ?
                    <React.Fragment>
                        <Modal.Header>Request access to view product details</Modal.Header>

                        <Modal.Content image>
                            <Modal.Description>
                                <p> Send a access request to <strong>{this.props.orgName}</strong> to view details for order id: <strong>{this.props.orderId}</strong> </p>
                            </Modal.Description>
                        </Modal.Content>
                        <Form className="app-margin-modal">
                            <Form.TextArea label='Comment' rows={2} name="comment"
                                onChange={this.handleChange}
                                defaultValue={this.state.comment}
                                placeholder='Tell us more' required />
                        </Form>

                        <Modal.Actions>
                            <Button color='black' onClick={() => this.setOpen(false)}>
                                Exit
                            </Button>
                            <Button
                                content="Request"
                                labelPosition='right'
                                icon='checkmark'
                                onClick={() => this.requestAccess()}
                                color='teal'
                            />
                        </Modal.Actions>
                    </React.Fragment>
                    : <Modal.Content >
                        <Modal.Description>
                            {this.state.doesRequestAlredayExists ? <h1>Request Alreday exists</h1> :
                                this.state.createAccessRequestStatus ? <h1> Request send successfully</h1> : <h1> Failure in sending request</h1>}
                        </Modal.Description>
                    </Modal.Content>
                }
            </Modal>
        )
    }
}
