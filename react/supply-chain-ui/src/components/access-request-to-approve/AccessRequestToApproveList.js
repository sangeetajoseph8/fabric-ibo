import React, { Component } from 'react'
import { Table, Container, Header, Icon, Segment } from 'semantic-ui-react'
import API from '../Api'
import Moment from 'react-moment';

export default class AccessRequestToApproveList extends Component {

    constructor() {
        super()
        this.state = {
            accessRequestList: []
        }
    }

    componentDidMount() {
        API.getAccessRequestsForApprovingOrg((list) => {
            console.log(list)
            if (list)
                this.setState({ accessRequestList: this.state.accessRequestList.concat(list.accessRequests) })
        })
    }

    handleClick = (item) => {
        this.props.history.push(
            {
                pathname: '/accessRequestToApproveDetails',
                search: '?requestId=' + item.orderId,
                state: { detail: item }
            }
        )
    }

    render() {
        const { accessRequestList } = this.state

        return (
            <Container style={{ margin: 20, width: 1000 }} textAlign='center' >
                <Segment raised >
                    <Header as='h2' color='teal' textAlign='center' dividing>
                        Access Request List
                </Header>
                    <Table celled padded color="teal" key="teal" selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={2}>Order Id</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Organization Name</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Date</Table.HeaderCell>
                                <Table.HeaderCell width={5}>Comments</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Approval Status</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                accessRequestList.length ?
                                    accessRequestList.map(item =>

                                        <Table.Row onClick={() => this.handleClick(item)} key={item.accessRequestId}>
                                            <Table.Cell>
                                                <Header as='h4'>
                                                    {item.orderId}
                                                </Header>
                                            </Table.Cell>
                                            <Table.Cell singleLine>
                                                {item.approvingOrgName}
                                            </Table.Cell>

                                            <Table.Cell>
                                                <Moment format="MMMM DD, YYYY">
                                                    {item.publishedDate}
                                                </Moment>

                                            </Table.Cell>

                                            <Table.Cell>
                                                {item.commentFromRequestingOrg && item.commentFromRequestingOrg.length > 55 ?
                                                    item.commentFromRequestingOrg.substring(0, 55) + ".."
                                                    : item.commentFromRequestingOrg}
                                            </Table.Cell>

                                            <Table.Cell>
                                                {item.approvalStatus}

                                                {(item.approvalStatus === "REJECTED") ?
                                                    <Icon className="lable-right-align" name="remove circle" color='red' size='large' /> :
                                                    (item.approvalStatus === "APPROVED") ?
                                                        <Icon name="check" className="lable-right-align" color='green' size='large' /> : null
                                                }

                                            </Table.Cell>
                                        </Table.Row>

                                    )
                                    : <Table.Row><Table.Cell>No Product History Found</Table.Cell></Table.Row>
                            }
                        </Table.Body>
                    </Table>
                </Segment>
            </ Container>
        )
    }
}
