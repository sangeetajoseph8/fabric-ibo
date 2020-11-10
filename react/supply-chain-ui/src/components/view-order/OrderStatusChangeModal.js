import React, { Component } from 'react'
import { Header, Button, Modal, Dimmer, Loader, Form } from 'semantic-ui-react'
import API from '../Api'

export default class OrderStatusChangeModal extends Component {
    constructor() {
        super()
        this.state = {
            open: false,
            responseMessage: '',
            isLoadingActive: false,
            comment: "",
        }
    }

    setOpen = (value) => {
        this.setState({
            open: value
        })
    }
    handleChange = (event) => {
        this.setState({ comment: event.target.value })
    }

    changeStatus = (status) => {
        this.setState({ isLoadingActive: true })
        var data = {
            orderId: this.props.orderId,
            orderStatus: status,
            comment: this.state.comment
        }
        console.log(data)
        API.updateOrderStatus(data, (response) => {
            if (response != null) {
                console.log("succes")
                this.setState({ responseMessage: 'Order status updated successfully' })
                setTimeout(() => {
                    window.location.reload();
                }, 1500)
            } else {
                console.log("failure")
                this.setState({ responseMessage: 'Failure in upating order status.' })
                setTimeout(() => {
                    window.location.reload();
                }, 1500)
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
                trigger={<Button className="lable-right-align"
                    content="Change Status"
                    labelPosition='right'
                    icon='tag'
                    color='blue' />} >

                {this.state.isLoadingActive ?
                    <Dimmer active inverted>
                        <Loader inverted content='Loading' />
                    </Dimmer>
                    : null}
                <Modal.Header icon> Approve or Reject Order Details</Modal.Header>

                {this.state.responseMessage ?

                    <Modal.Content>
                        <Header as='h3' textAlign="center">
                            {this.state.responseMessage}
                        </Header>
                    </Modal.Content>
                    :
                    <React.Fragment>

                        <Modal.Content image>
                            <Modal.Description>
                                <p> Please add your comments before approving/rejecting the order</p>
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
                                content="Reject"
                                labelPosition='right'
                                icon='close'
                                onClick={() => this.changeStatus("REJECTED")}
                                color='red'
                            />
                            <Button
                                content="Approve"
                                labelPosition='right'
                                icon='checkmark'
                                onClick={() => this.changeStatus("APPROVED")}
                                color='green'
                            />
                        </Modal.Actions>
                    </React.Fragment>
                }
            </Modal>

        )
    }
}
