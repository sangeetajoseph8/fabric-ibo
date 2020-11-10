import React, { Component } from 'react'
import { Container, Grid, Header, Divider, Icon, Button, Dimmer, Loader, Message, Segment } from 'semantic-ui-react'
import Moment from 'react-moment';
import { Link } from "react-router-dom";


export default class ReviewOrder extends Component {

    saveAndContinue = (e) => {
        e.preventDefault()
        this.props.saveToIpfs()
        this.props.saveConnections()
    }

    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }

    render() {
        const { orderId, approverOrg, payload, comment, orderType, orderDate, ipfsFiles, connectionList } = this.props.values

        return (
            <React.Fragment >
                {this.props.isLoadingActive ?
                    <Dimmer active inverted page>
                        <Loader inverted content='Loading' />
                    </Dimmer> : null}

                <Container style={{ margin: 20, width: 600 }}>
                    <Segment>
                        {!this.props.hasSuccessfullyCreatedOrder ?
                            <Message negative>
                                <Message.Header>Failure in saving Order Details</Message.Header>
                                <p>
                                    Please try again.
                        </p>
                            </Message>

                            : null}

                        <Header as='h2' color='teal' textAlign='center' dividing>
                            Product Details Review
                 </Header>
                        <Grid >
                            <Grid.Row columns={2}>
                                <Grid.Column width={6}>
                                    <Header as='h4'>Order Id: </Header>
                                </Grid.Column>
                                <Grid.Column width={10}>{orderId}</Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={6}>
                                    <Header as='h4'>Date: </Header>
                                </Grid.Column>
                                <Grid.Column width={10}><Moment format="MMMM DD, YYYY">{orderDate}</Moment></Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={6}>
                                    <Header as='h4'>Order Type: </Header>
                                </Grid.Column>
                                <Grid.Column width={10}>{orderType}</Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={6}>
                                    <Header as='h4'>Approver Organisation Name: </Header>
                                </Grid.Column>
                                <Grid.Column width={10}>{approverOrg}</Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={6}>
                                    <Header as='h4'>Payload: </Header>
                                </Grid.Column>
                                <Grid.Column width={10}>{payload}</Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={6}>
                                    <Header as='h4'>Comment: </Header>
                                </Grid.Column>
                                <Grid.Column width={10}>{comment}</Grid.Column>
                            </Grid.Row>


                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Divider horizontal>
                                        <Header as='h4'>
                                            <Icon name='tag' />
                                Files
                            </Header>
                                    </Divider>
                                </Grid.Column>
                            </Grid.Row>

                            {ipfsFiles.length ?
                                <Grid.Row columns={2}>
                                    <Grid.Column width={6}>
                                        <Header as='h4'>Files: </Header>
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        {ipfsFiles.map(item => <div>{item.name} </div>)}
                                    </Grid.Column>
                                </Grid.Row> :
                                <Grid.Row columns={1}> <Grid.Column textAlign="center"> No files uploaded </Grid.Column></Grid.Row>
                            }

                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Divider horizontal>
                                        <Header as='h4'>
                                            <Icon name='tag' />
                                Connections
                            </Header>
                                    </Divider>
                                </Grid.Column>
                            </Grid.Row>

                            {connectionList.length ?
                                <Grid.Row columns={2}>
                                    <Grid.Column width={6}>
                                        <Header as='h4'>Order Ids: </Header>
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        {connectionList.map(item => <div>
                                            <Link to={`/orderDetails/${item.orderId}`} >
                                                {item.orderId}
                                            </Link>
                                        </div>)}
                                    </Grid.Column>
                                </Grid.Row> :
                                <Grid.Row columns={1}> <Grid.Column textAlign="center"> No connections provided </Grid.Column></Grid.Row>
                            }

                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Button secondary onClick={this.back}>Back</Button>
                                    <Button color='teal' onClick={this.saveAndContinue} style={{ float: 'right' }}>Save And Continue</Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Container>
            </React.Fragment>
        )
    }
}
