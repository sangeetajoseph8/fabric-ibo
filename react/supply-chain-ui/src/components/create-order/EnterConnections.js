import React, { Component } from 'react'
import { Container, Button, Form, Input, Segment, Header } from 'semantic-ui-react'
import API from '../Api'

export default class EnterConnections extends Component {
    constructor() {
        super()
        this.state = {
            productId_1: '',
            productId_2: '',
            productId_3: '',
            productId_4: '',
            productId_5: '',
            errors: {
                productId_1: false,
                productId_2: false,
                productId_3: false,
                productId_4: false,
                productId_5: false
            }

        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    saveAndContinue = (e) => {
        e.preventDefault()
        API.getProductDetails("GET_ORDER_DETAILS", this.state.productId_1, {
            callback: () => {
                console.log("Testing")
            }
        })
    }

    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }
    render() {
        const { errors } = this.state;
        return (
            <Container style={{ margin: 20, width: 500 }}>
                <Header as='h2' color='teal' textAlign='center' dividing>
                    Product Connections
                 </Header>
                <Form onSubmit={this.saveAndContinue}>
                    <Segment raised >
                        <Form.Input label="Product Id 1:" placeholder='Product Id' name='productId_1'
                            onChange={this.props.handleConnectionChange}
                            error={errors.productId_1 > 0 && { content: 'Product does not exists', pointing: 'above' }} />

                        <Form.Input label="Product Id 2:" placeholder='Product Id' name='productId_2'
                            onChange={this.props.handleConnectionChange}
                            error={errors.productId_2 > 0 && { content: 'Product does not exists', pointing: 'above' }} />


                        <Form.Input label="Product Id 3:" placeholder='Product Id' name='productId_3'
                            onChange={this.props.handleConnectionChange}
                            error={errors.productId_3 > 0 && { content: 'Product does not exists', pointing: 'above' }} />


                        <Form.Input label="Product Id 4:" placeholder='Product Id' name='productId_4'
                            onChange={this.props.handleConnectionChange}
                            error={errors.productId_4 > 0 && { content: 'Product does not exists', pointing: 'above' }} />


                        <Form.Input label="Product Id 5:" placeholder='Product Id' name='productId_5'
                            onChange={this.props.handleConnectionChange}
                            error={errors.productId_5 > 0 && { content: 'Product does not exists', pointing: 'above' }} />

                        <Button secondary onClick={this.back}>Back</Button>
                        <Button color='teal' onClick={this.saveAndContinue} style={{ float: 'right' }}>Save And Continue</Button>
                    </Segment>
                </Form>

            </Container >
        )
    }
}
