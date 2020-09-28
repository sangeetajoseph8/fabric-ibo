import { Container, Button, Form } from 'semantic-ui-react'
import React, { Component } from 'react'
import API from './Api'

export class RegisterUser extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            orgname: ''
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        const userData = {
            username: this.state.username,
            orgName: this.state.orgname
        }

        console.log(userData)
        API.registerUser("REGISTER_USER", userData, {
            callback: () => {
                console.log("Testing")
            }
        })

    }

    render() {

        return (
            <Container style={{ margin: 20 }}>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label className="lable-left-align">User Name</label>
                        <input placeholder='First Name' name='username' onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label className="lable-left-align">Organisation Name</label>
                        <input placeholder='Last Name' name='orgname' onChange={this.handleChange} />
                    </Form.Field>

                    <Button className="lable-left-align">Submit</Button>
                </Form>
            </Container>
        )
    }
}

export default RegisterUser
