import React, { Component } from 'react'
import { Container, Header, Icon, Segment, Grid, Divider, GridColumn, Form, Button } from 'semantic-ui-react'
import API from '../Api'
import "react-datepicker/dist/react-datepicker.css"
import OrderComment from '../OrderComment'
import OrderDetailsDeleteModal from './OrderDetailsDeleteModal'
import { Link } from "react-router-dom";
import OrderStatusChangeModal from './OrderStatusChangeModal'
import Moment from 'react-moment';

export default class ViewOrderDetails extends Component {
    constructor() {
        super()
        this.state = {
            orderDetails: {
                orderId: '',
                approverOrgName: '',
                fileList: [],
                initiatorOrgApprovalStatus: '',
                initiatorOrgName: '',
                orderDate: '',
                orderLastUpdatedByOrgName: '',
                orderType: '',
                payload: '',
                commentList: [],
                connectionList: []
            },
            comment: ''
        }
    }

    componentDidMount() {
        console.log(this.props)
        API.getProductDetails(this.props.match.params.orderId, data => {
            console.log(data)
            if (data) {
                this.setState({ orderDetails: data })
            }
        })
        console.log(this.state)
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    addComment = () => {
        let comment = {
            commentString: this.state.comment,
            orgName: localStorage.getItem('orgName', ""),
            userName: localStorage.getItem('username', ""),
            publishedDate: new Date()
        }
        this.setState(prevState => ({
            orderDetails: {
                ...prevState.orderDetails,
                commentList: this.state.orderDetails.commentList.concat(comment)
            }
        }))
    }

    handleDateChange = (date) => {
        console.log(date)
        this.setState({
            orderDate: date
        });
    };


    render() {
        const { orderId, approverOrgName, fileList, initiatorOrgApprovalStatus,
            initiatorOrgName, lastUpdated, orderDate, orderLastUpdatedByOrgName, approvalNeededForOrg,
            orderType, payload, publishedDate, commentList, connectedOrderIds, approverOrgApprovalStatus } = this.state.orderDetails

        return (
            <Container style={{ margin: 20, width: 700 }}>
                <Segment raised >
                    <Header as='h2' color='teal' textAlign='center' dividing>
                        Access Request Details
                    </Header>
                    <Grid >
                        {orderId === '' ?
                            <Grid.Row columns={1}>
                                <Grid.Column width={5}>
                                    <Header as='h4'>No order details found</Header>
                                </Grid.Column>

                            </Grid.Row>
                            :
                            <React.Fragment>
                                <Grid.Row columns={2}>
                                    <Grid.Column width={5}>
                                        <Header as='h4'>Order Id: </Header>
                                    </Grid.Column>
                                    <Grid.Column width={11}>{orderId}</Grid.Column>
                                </Grid.Row>

                                <Grid.Row columns={2}>
                                    <Grid.Column width={5}>
                                        <Header as='h4'>Order Date: </Header>
                                    </Grid.Column>
                                    <Grid.Column width={11}>
                                        <Moment format="LLL">
                                            {orderDate}
                                        </Moment>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row columns={2}>
                                    <Grid.Column width={5}>
                                        <Header as='h4'>Order Type: </Header>
                                    </Grid.Column>
                                    <Grid.Column width={11}>{orderType}</Grid.Column>
                                </Grid.Row>

                                <Grid.Row columns={2}>
                                    <Grid.Column width={5}>
                                        <Header as='h4'>Initiator Organisation Name: </Header>
                                    </Grid.Column>
                                    <Grid.Column width={11}>{initiatorOrgName}</Grid.Column>
                                </Grid.Row>

                                <Grid.Row columns={2}>
                                    <Grid.Column width={5}>
                                        <Header as='h4'>Approver Organisation Name: </Header>
                                    </Grid.Column>
                                    <Grid.Column width={11}>{approverOrgName}</Grid.Column>
                                </Grid.Row>

                                <Grid.Row columns={2}>
                                    <Grid.Column width={5}>
                                        <Header as='h4'>Payload: </Header>
                                    </Grid.Column>
                                    <Grid.Column width={11}>{payload}</Grid.Column>
                                </Grid.Row>

                                <Grid.Row columns={1}>
                                    <Grid.Column>
                                        <Divider horizontal>
                                            <Header as='h4'><Icon name='tag' />Comments </Header>
                                        </Divider>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row columns={1}>
                                    {
                                        commentList != null && commentList.length ?
                                            commentList.map(item =>
                                                <Grid.Row columns={1} key={item.publishedDate}>
                                                    <Grid.Column>
                                                        <OrderComment
                                                            userName={item.userName}
                                                            orgName={item.orgName}
                                                            comment={item.commentString}
                                                            date={item.publishedDate}
                                                            avatar={item.orgName === initiatorOrgName ? 1 : 2
                                                            } />
                                                    </Grid.Column>
                                                </Grid.Row>) : null
                                    }
                                </Grid.Row>

                                { /*
                                <Grid.Row columns={1}>
                                    <GridColumn>
                                        <Form reply>
                                            <Form.TextArea name='comment' onChange={this.handleChange} />
                                            <Button content='Add Comment' labelPosition='left' icon='edit' color="teal" onClick={this.addComment} />
                                        </Form>
                                    </GridColumn>
                                </Grid.Row>*/}

                                <Grid.Row columns={1}>
                                    <Grid.Column>
                                        <Divider horizontal>
                                            <Header as='h4'><Icon name='tag' />Files </Header>
                                        </Divider>
                                    </Grid.Column>
                                </Grid.Row>
                                {
                                    fileList != null && fileList.length ?
                                        <Grid.Row columns={2}>
                                            <Grid.Column width={5}>
                                                <Header as='h4'>Files: </Header>
                                            </Grid.Column>

                                            <Grid.Column width={11}>
                                                {fileList.map(item => <div key={item.hash}>{item.name} </div>)}
                                            </Grid.Column>
                                        </Grid.Row> :
                                        <Grid.Row columns={1}> <Grid.Column textAlign="center"> No files uploaded </Grid.Column></Grid.Row>
                                }

                                <Grid.Row columns={1}>
                                    <Grid.Column>
                                        <Divider horizontal>
                                            <Header as='h4'><Icon name='tag' />Connections</Header>
                                        </Divider>
                                    </Grid.Column>
                                </Grid.Row>
                                {
                                    connectedOrderIds != null && connectedOrderIds.length ?
                                        <Grid.Row columns={2}>
                                            <Grid.Column width={5}>
                                                <Header as='h4'>Order Ids: </Header>
                                            </Grid.Column>
                                            <Grid.Column width={11}>
                                                {connectedOrderIds.map(item =>
                                                    <div key={item}>
                                                        <Link to={`/orderDetails/${item}`}>
                                                            {item}
                                                        </Link>
                                                    </div>
                                                )}
                                            </Grid.Column>
                                        </Grid.Row> : <Grid.Row columns={1}> <Grid.Column textAlign="center"> No connections found </Grid.Column></Grid.Row>
                                }


                                {approverOrgName === null || approverOrgName === '' ? null :
                                    <React.Fragment>
                                        <Grid.Row columns={1}>
                                            <Grid.Column>
                                                <Divider horizontal>
                                                    <Header as='h4'><Icon name='tag' />Order Status</Header>
                                                </Divider>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row columns={3} relaxed='very'>
                                            <Grid.Column>
                                                <Header textAlign='center'>{initiatorOrgName}</Header>
                                                <div id="outer">
                                                    <div id="inner">
                                                        {initiatorOrgApprovalStatus === 'APPROVED' ?
                                                            <Icon name='check square' color='green' size='big' /> :
                                                            initiatorOrgApprovalStatus === 'REJECTED' ?
                                                                <Icon name='cancel' color='red' size='big' /> :
                                                                initiatorOrgApprovalStatus === 'PENDING' ?
                                                                    <Icon name='clock' color='blue' size='big' /> : null}
                                                    </div>
                                                </div>
                                                <Header textAlign='center' as='h5'>{initiatorOrgApprovalStatus}</Header>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Divider vertical>And</Divider>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Header textAlign='center'>{approverOrgName}</Header>
                                                <div id="outer">
                                                    <div id="inner">
                                                        {approverOrgApprovalStatus === 'APPROVED' ?
                                                            <Icon name='check square' color='green' size='big' /> :
                                                            approverOrgApprovalStatus === 'REJECTED' ?
                                                                <Icon name='cancel' color='red' size='big' /> :
                                                                approverOrgApprovalStatus === 'PENDING' ?
                                                                    <Icon name='clock' color='blue' size='big' /> : null}
                                                    </div>
                                                </div>
                                                <Header textAlign='center' as='h5'>{approverOrgApprovalStatus}</Header>

                                            </Grid.Column>
                                        </Grid.Row>
                                    </React.Fragment>
                                }

                            </React.Fragment>
                        }
                        <Grid.Row columns={1}>
                            <Grid.Column>
                                {approvalNeededForOrg !== null && approvalNeededForOrg === localStorage.getItem('orgName', "") ?
                                    <OrderStatusChangeModal orderId={orderId} history={this.props.history} className="ui fluid button" basic color='blue' /> : null
                                }
                                <OrderDetailsDeleteModal orderId={orderId} history={this.props.history} className="ui fluid button" basic color='red' />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </Segment>
            </Container>
        )
    }
}
