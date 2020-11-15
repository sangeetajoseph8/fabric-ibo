import React, { Component } from 'react'
import { Table, Container, Header, Icon, Segment } from 'semantic-ui-react'
import API from '../Api'
import Moment from 'react-moment';
export default class ApprovalOrderList extends Component {
    constructor() {
        super()
        this.state = {
            orderList: []
        }
    }

    componentDidMount() {
        API.getAllUnapprovedOrders((list) => {
            console.log(list)
            if (list)
                this.setState({ orderList: this.state.orderList.concat(list.orders) })
        })
    }

    handleClick = (item) => {
        this.props.history.push(
            {
                pathname: '/orderDetails/' + item.orderId,
                state: { orderId: item.orderId }
            }
        )
    }

    render() {
        const { orderList } = this.state

        return (
            <Container style={{ margin: 20, width: 1000 }} textAlign='center' >
                <Segment raised >
                    <Header as='h2' color='teal' textAlign='center' dividing>
                        Order List
                </Header>
                    <Table celled padded color="teal" key="teal" selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={2}>Order Id</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Order Type</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Date</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Approver Org Name</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Approval Status</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                orderList.length !== 0 ?
                                    orderList.map(item =>

                                        <Table.Row onClick={() => this.handleClick(item)} key={item.orderId}>
                                            <Table.Cell>
                                                <Header as='h4'>{item.orderId}</Header>
                                            </Table.Cell>
                                            <Table.Cell singleLine>{item.orderType}</Table.Cell>

                                            <Table.Cell>
                                                <Moment format="MMMM DD, YYYY">{item.orderDate}</Moment>
                                            </Table.Cell>

                                            <Table.Cell> {item.approverOrgName} </Table.Cell>

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
                                    : <Table.Row><Table.Cell>No Orders Found</Table.Cell></Table.Row>
                            }
                        </Table.Body>
                    </Table>
                </Segment>
            </ Container>
        )
    }
}
