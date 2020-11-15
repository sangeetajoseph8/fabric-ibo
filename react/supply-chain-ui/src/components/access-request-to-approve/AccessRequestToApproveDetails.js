import React, { Component } from 'react'
import { Container, Grid, Header, Divider, Icon, Segment } from 'semantic-ui-react'
import Moment from 'react-moment';
import AccessRequestApproveModal from './AccessRequestApproveModal'
import { Link } from "react-router-dom";

export default class AccessRequestDetails extends Component {
    handleClick = (item) => {
        this.props.history.push(
            {
                pathname: '/orderDetails/' + item.orderId,
                state: { orderId: item.orderId }
            }
        )
    }

    render() {
        const { orderId, approvingOrgName, publishedDate, commentFromRequestingOrg, approvalStatus, commentFromApprovingOrg, approvalDate, accessRequestId } = this.props.location.state.detail
        return (
            <Container style={{ margin: 20, width: 700 }}>
                <Segment raised >
                    <Header as='h2' color='teal' textAlign='center' dividing>
                        Access Request Details
                </Header>
                    <Grid >
                        <Grid.Row columns={2}>
                            <Grid.Column width={5}>
                                <Header as='h4'>Order Id : </Header>
                            </Grid.Column>
                            <Grid.Column width={11}>{orderId}</Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column width={5}>
                                <Header as='h4'>Date: </Header>
                            </Grid.Column>
                            <Grid.Column width={11}><Moment format="MMMM DD, YYYY">{publishedDate}</Moment></Grid.Column>

                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column width={5}>
                                <Header as='h4'>Organization Name: </Header>
                            </Grid.Column>
                            <Grid.Column width={11}>{approvingOrgName}</Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column width={5}>
                                <Header as='h4'>Comment: </Header>
                            </Grid.Column>
                            <Grid.Column width={11}><p>{commentFromRequestingOrg}</p></Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={1}>
                            <Grid.Column>
                                <Divider horizontal>
                                    <Header as='h4'>
                                        <Icon name='tag' />
                                Approval Status
                            </Header>
                                </Divider>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column width={5}>
                                <Header as='h4'>Status: </Header>
                            </Grid.Column>
                            <Grid.Column width={11}><p>{approvalStatus}</p></Grid.Column>
                        </Grid.Row>
                        {commentFromApprovingOrg !== null ?
                            <Grid.Row columns={2}>
                                <Grid.Column width={5}>
                                    <Header as='h4'>Comments from {approvingOrgName}: </Header>
                                </Grid.Column >
                                <Grid.Column width={11}><p>{commentFromApprovingOrg}</p></Grid.Column>
                            </Grid.Row> : null
                        }
                        {approvalStatus !== 'PENDING' ?
                            <Grid.Row columns={2}>
                                <Grid.Column width={5}>
                                    <Header as='h4'>Date of Approval: </Header>
                                </Grid.Column>
                                <Grid.Column width={11}> <Moment format="MMMM DD, YYYY">{approvalDate}</Moment></Grid.Column>
                            </Grid.Row> : null
                        }

                        {approvalStatus === 'APPROVED' ?
                            <Grid.Row columns={2}>
                                <Grid.Column width={5}>
                                    <Header as='h4'>Order Details Link: </Header>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    <Link to={`/orderDetails/${orderId}`} >
                                        {orderId}
                                    </Link>
                                </Grid.Column>
                            </Grid.Row> : null
                        }

                        <Grid.Row columns={1}>
                            <Grid.Column>
                                <AccessRequestApproveModal accessRequestId={accessRequestId} history={this.props.history} className="ui fluid button" basic color='red' />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </Segment>
            </Container >
        )
    }
}
