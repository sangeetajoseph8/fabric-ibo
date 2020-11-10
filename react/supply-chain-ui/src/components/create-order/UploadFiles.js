import React, { Component } from 'react'
import { Container, Button, Form, Header, Segment, List, Divider } from 'semantic-ui-react'

export default class UploadFiles extends Component {
    saveAndContinue = (e) => {
        e.preventDefault()
        this.props.nextStep()
    }
    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }
    render() {
        const { ipfsFiles } = this.props.values;

        return (
            <Container style={{ margin: 20, width: 600 }}>
                <Segment raised>
                    <Header as='h2' color='teal' textAlign='center' dividing>
                        Product Details
                 </Header>
                    <Form >

                        <Form.Group inline>
                            <div className="field">
                                <label className="app-lable"> Upload Files: </label>
                                <input type="file" name="file" onChange={this.props.onFileChangeHandler} />
                            </div>
                        </Form.Group>

                        {ipfsFiles.length !== 0 ? <React.Fragment>
                            <Divider horizontal>
                                <Header as='h4'>Files to upload
                                </Header></Divider>
                            <List>
                                {ipfsFiles.map(item =>
                                    <List.Item>
                                        <List.Content>
                                            {item.name}
                                        </List.Content>
                                    </List.Item>
                                )}
                            </List>
                        </React.Fragment> : null}

                        <Button secondary onClick={this.back}>Back</Button>
                        <Button color='teal' onClick={this.saveAndContinue} style={{ float: 'right' }}>Save And Continue</Button>

                    </Form>
                </Segment>
            </Container>
        )
    }
}
