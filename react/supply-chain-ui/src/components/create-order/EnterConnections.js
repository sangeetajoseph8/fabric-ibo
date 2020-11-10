import React, { Component } from 'react'
import { Container, Button, Form, Segment, Header, List, Divider } from 'semantic-ui-react'
import API from '../Api'
import { Link } from "react-router-dom";

export default class EnterConnections extends Component {
    constructor() {
        super()
        this.state = {
            productId: '',
            error: false
        }
    }

    handleConnectionChange = (event) => {
        this.setState({
            productId: event.target.value,
            error: false
        })
    }

    saveAndContinue = (e) => {
        e.preventDefault()
        this.props.nextStep()
    }

    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }

    addToOrderListForConnections = (e) => {
        e.preventDefault();
        API.getProductDetails(this.state.productId, data => {

            if (data !== null && data.orderId === this.state.productId) {
                this.props.addToOrderListForConnection(data);
            } else {
                this.setState({ error: true })
            }
        })
    }

    render() {
        const { error } = this.state;
        const { connectionList } = this.props.values;
        return (
            <Container style={{ margin: 20, width: 600 }}>
                <Segment raised >
                    <Header as='h2' color='teal' textAlign='center' dividing>
                        Product Connections
                 </Header>
                    <Form>

                        <Form.Group inline>
                            <label className="app-lable" style={{ marginRight: '10px' }}> Order Id:</label>
                            <Form.Input placeholder='Product Id' name='orderIdForConnection'
                                error={error && { content: 'Product Id: ' + this.state.productId + ' does not exists', pointing: 'above' }}
                                onChange={this.handleConnectionChange} />
                            <Button secondary onClick={this.addToOrderListForConnections}
                                style={{ marginLeft: '5px' }}>Add connection</Button>
                        </Form.Group>
                        {connectionList.length !== 0 ? <React.Fragment>
                            <Divider horizontal>
                                <Header as='h4'>Order Ids for connections
                                </Header></Divider>
                            <List>
                                {connectionList.map(item =>
                                    <List.Item>
                                        <List.Content>
                                            <Link to={`/orderDetails/${item.orderId}`} >
                                                {item.orderId}
                                            </Link>
                                        </List.Content>
                                    </List.Item>
                                )}
                            </List>
                        </React.Fragment> : null}

                        <Button secondary onClick={this.back}>Back</Button>
                        <Button floated='right' color='teal' onClick={this.saveAndContinue} >Save And Review</Button>

                    </Form>
                </Segment>

            </Container >
        )
    }
}
