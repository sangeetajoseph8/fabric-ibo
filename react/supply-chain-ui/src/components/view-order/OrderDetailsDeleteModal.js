import React, { Component } from 'react'
import { Header, Icon, Button, Modal, Dimmer, Loader } from 'semantic-ui-react'
import API from '../Api'

export default class OrderDetailsDeleteModal extends Component {
    constructor() {
        super()
        this.state = {
            open: false,
            didRequestToDelete: false,
            deletionMessage: false,
            isLoadingActive: false
        }
    }

    deleteRequest = (orderId) => {
        this.setState({ didRequestToDelete: true })
        this.setState({ isLoadingActive: true })
        API.deleteOrderDetails({ orderId: orderId }, data => {
            if (data) {
                this.setState({ deletionMessage: 'Successfully Deleted!' })
                setTimeout(() => { this.props.history.push('/createdOrderList') }, 2000)
            } else {
                this.setState({ deletionMessage: 'Failure in deletion!' })
                setTimeout(() => { this.setState({ didRequestToDelete: false }) }, 2000)
            }
            this.setState({ isLoadingActive: false })
        })
    }
    setOpen = (value) => {
        this.setState({
            open: value
        })
    }

    render() {
        return (

            <Modal
                onClose={() => this.setOpen(false)}
                onOpen={() => this.setOpen(true)}
                open={this.state.open}
                trigger={<Button className="lable-right-align"
                    content="Delete"
                    labelPosition='right'
                    icon='trash alternate'
                    color='red' />}
            >
                {this.state.isLoadingActive ?
                    <Dimmer active inverted>
                        <Loader inverted content='Loading' />
                    </Dimmer> : null}
                <Header icon>
                    <Icon name='archive' />
                   Delete Order Details
                 </Header>

                {this.state.didRequestToDelete ?

                    <Modal.Content>
                        <Header as='h4' textAlign="center">
                            {this.state.deletionMessage}
                        </Header>
                    </Modal.Content>
                    :
                    <React.Fragment>
                        <Modal.Content>
                            <p>
                                Are you sure want to delete this order?
                            </p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={() => this.setOpen(false)}>
                                Exit
                            </Button>
                            <Button className="lable-right-align"
                                content="Delete"
                                labelPosition='right'
                                icon='trash alternate'
                                onClick={() => this.deleteRequest(this.props.orderId)}
                                color='red' />
                        </Modal.Actions>
                    </React.Fragment>
                }

            </Modal>

        )
    }
}
