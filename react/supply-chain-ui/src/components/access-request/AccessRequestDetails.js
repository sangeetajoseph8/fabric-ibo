import React, { Component } from 'react'
import { Container, Grid, Header, Divider, Icon, Button, Segment } from 'semantic-ui-react'
import Moment from 'react-moment';
import AccessRequestDeleteModal from './AccessRequestDeleteModal'


export default class AccessRequestDetails extends Component {

    render() {
        console.log(this.props.history)
        const { orderId, approvingOrgName, publishedDate, commentFromRequestingOrg, approvalStatus, commentFromApprovingOrg, approvalDate, accessRequestId } = this.props.location.state.detail
        return (
            <Container style={{ margin: 20, width: 500 }}>
                <Segment raised >
                    <Header as='h2' color='teal' textAlign='center' dividing>
                        Access Request Details
                </Header>
                    <Grid >
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Header as='h4'>Order Id : </Header>
                            </Grid.Column>
                            <Grid.Column>{orderId}</Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Header as='h4'>Date: </Header>
                            </Grid.Column>
                            <Grid.Column><Moment format="MMMM DD, YYYY">{publishedDate}</Moment></Grid.Column>

                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Header as='h4'>Organization Name: </Header>
                            </Grid.Column>
                            <Grid.Column>{approvingOrgName}</Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Header as='h4'>Comment: </Header>
                            </Grid.Column>
                            <Grid.Column><p>{commentFromRequestingOrg}</p></Grid.Column>
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
                            <Grid.Column>
                                <Header as='h4'>Status: </Header>
                            </Grid.Column>
                            <Grid.Column><p>{approvalStatus}</p></Grid.Column>
                        </Grid.Row>
                        {commentFromApprovingOrg != null ?
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Header as='h4'>Comments from {approvingOrgName}: </Header>
                                </Grid.Column>
                                <Grid.Column><p>{commentFromApprovingOrg}</p></Grid.Column>
                            </Grid.Row> : null
                        }
                        {approvalStatus != 'PENDING' ?
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Header as='h4'>Date of Approval: </Header>
                                </Grid.Column>
                                <Grid.Column> <Moment format="MMMM DD, YYYY">{approvalDate}</Moment></Grid.Column>
                            </Grid.Row> : null
                        }

                        {approvalStatus == 'APPROVED' ?
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Header as='h4'>Order Details Link: </Header>
                                </Grid.Column>
                                <Grid.Column> </Grid.Column>
                            </Grid.Row> : null
                        }

                        <Grid.Row columns={1}>
                            <Grid.Column>
                                <AccessRequestDeleteModal accessRequestId={accessRequestId} history={this.props.history} className="ui fluid button" basic color='red' />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </Segment>
            </Container >
        )
    }
}
