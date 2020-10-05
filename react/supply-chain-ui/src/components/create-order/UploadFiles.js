import React, { Component } from 'react'
import { Container, Button, Form, Header, Segment } from 'semantic-ui-react'

export default class UploadFiles extends Component {
    saveAndContinue = (e) => {
        e.preventDefault()
        this.props.saveToIpfs()
        this.props.nextStep()
    }
    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }
    render() {
        return (
            <Container style={{ margin: 20, width: 500 }}>
                <Header as='h2' color='teal' textAlign='center' dividing>
                    Product Details
                 </Header>
                <Form >
                    <Segment raised>
                        <div className="field">
                            <label className="app-lable"> Upload File 1</label>
                            <input type="file" name="file" onChange={this.props.onFileChangeHandler} />
                        </div>
                        <div className="field">
                            <label className="app-lable"> Upload File 2</label>
                            <input type="file" name="file" onChange={this.props.onFileChangeHandler} />
                        </div>
                        <div className="field">
                            <label className="app-lable"> Upload File 3</label>
                            <input type="file" name="file" onChange={this.props.onFileChangeHandler} />
                        </div>
                        <div className="field">
                            <label className="app-lable"> Upload File 4</label>
                            <input type="file" name="file" onChange={this.props.onFileChangeHandler} />
                        </div>
                        <div className="field">
                            <label className="app-lable"> Upload File 5</label>
                            <input type="file" name="file" onChange={this.props.onFileChangeHandler} />
                        </div>
                        <Button secondary onClick={this.back}>Back</Button>
                        <Button color='teal' onClick={this.saveAndContinue} style={{ float: 'right' }}>Save And Continue</Button>
                    </Segment>
                </Form>
            </Container>
        )
    }
}
