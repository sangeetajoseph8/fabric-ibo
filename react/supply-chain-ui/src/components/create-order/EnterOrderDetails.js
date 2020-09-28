import React, { Component } from 'react'
import { Container, Button, Form, Input, Header, Segment } from 'semantic-ui-react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"


export default class Step1 extends Component {

    saveAndContinue = (e) => {
        e.preventDefault()
        this.props.nextStep()
    }


    render() {
        const { values } = this.props;
        return (
            <Container style={{ margin: 20, width: 500 }}>
                <Header as='h2' color='teal' textAlign='center' dividing>
                    Product Details
                 </Header>
                <Form onSubmit={this.saveAndContinue}>
                    <Segment raised>
                        <Form.Input label="Product Id" placeholder='Product Id' name='orderId'
                            defaultValue={values.orderId} onChange={this.props.handleChange} />

                        <div className="field">
                            <label className="app-lable"> Order Date</label>
                            <DatePicker selected={values.orderDate} onChange={this.props.handleDateChange} />
                        </div>

                        <div className="field">
                            <label className="app-lable"> Order Type </label>
                            <Input list='languages' placeholder='Choose Order Type...' defaultValue={values.orderType} name='orderType' onChange={this.props.handleChange} />
                            <datalist id='languages'>
                                <option value='Manufacturing'>Manufacturing</option>
                                <option value='Shipment'>Shipment</option>
                                <option value='Raw Material Supplier'>Raw Material Supplier</option>
                                <option value='Component Supplier'>Component Supplier</option>
                                <option value='Others'>Others</option>
                            </datalist>
                        </div>

                        <Form.Input label="Approver Organisation Name" name='approverOrg' onChange={this.props.handleChange} defaultValue={values.approverOrg} />

                        <Form.TextArea label='Payload' name='payload' onChange={this.props.handleChange} defaultValue={values.payload} />
                        <Form.TextArea label='Comment' name='comment' onChange={this.props.handleChange} defaultValue={values.comment} />
                        <Button color='teal' floated='right'>Save And Continue</Button>
                    </Segment>
                </Form>
            </Container>
        )
    }
}
