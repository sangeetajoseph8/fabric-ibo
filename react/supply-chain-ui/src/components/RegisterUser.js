import { Container, Button, Form, Segment, Header, Message } from 'semantic-ui-react'
import React, { Component } from 'react'
import API from './Api'

export class RegisterUser extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            orgname: '',
            errorInRegistration: false
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
        API.registerUser(userData, (result) => {
            if (result) {
                this.setState({ errorInRegistration: false })
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            } else {
                this.setState({ errorInRegistration: true })
            }
        })
    }

    render() {

        return (
            <Container style={{ margin: 20, width: 600 }}>
                <Segment raised>
                    {this.state.errorInRegistration ?
                        <Message negative>
                            <Message.Header>Failure while registration</Message.Header>
                            <p>
                                Please try again.
                        </p>
                        </Message>

                        : null}

                    {localStorage.getItem('username', null) !== "null" ?
                        <Container >
                            <Header textAlign='center'
                                as='h1'
                                content={'Welcome'}
                                style={{
                                    fontSize: '4em',
                                    fontWeight: 'normal',
                                    marginBottom: 0,
                                    marginTop: '3em',
                                }}
                            />
                            <Header textAlign='center'
                                as='h1'
                                content={localStorage.getItem('username', "") +
                                    ' - ' +
                                    localStorage.getItem('orgName', "")}
                                style={{
                                    fontSize: '4em',
                                    fontWeight: 'normal',
                                    marginBottom: 0,
                                    marginTop: '0',
                                }}
                            />
                            <Header textAlign='center'
                                as='h2'
                                content='Get Started!'
                                style={{
                                    fontSize: '1.7em',
                                    fontWeight: 'normal',
                                    marginTop: '1.5em',
                                    marginBottom: 100
                                }}
                            />
                        </Container>
                        :
                        <React.Fragment>
                            <Header as='h2' color='teal' textAlign='center' dividing>
                                Register User
                        </Header>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Field>
                                    <label className="lable-left-align">User Name</label>
                                    <input placeholder='First Name' name='username' onChange={this.handleChange} />
                                </Form.Field>
                                <Form.Field>
                                    <label className="lable-left-align">Organisation Name</label>
                                    <input placeholder='Last Name' name='orgname' onChange={this.handleChange} />
                                </Form.Field>

                                <Button color='teal'>Submit</Button>
                            </Form>
                        </React.Fragment>}
                </Segment>
            </Container >
        )
    }
}

export default RegisterUser
