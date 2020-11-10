import React, { Component } from 'react'
import { Step, Container, Header, Segment } from 'semantic-ui-react'
import ProductHistoryStep from './ProductHistoryStep'
import API from '../Api'

export default class ProductHistory extends Component {
    constructor() {
        super()

        this.state = {
            productHistory: []
        }
    }

    componentDidMount() {
        API.getConnectionHistory("CONNECTION_HISTORY", "MOO1", (list) => {
            console.log(list)
            if (list && list.productHistories)
                this.setState({ productHistory: this.state.productHistory.concat(list.productHistories) })
            console.log(this.state)
        })
    }

    render() {
        console.log(this.state.productHistory)
        const { productHistory } = this.state
        console.log(productHistory)
        return (
            <Container style={{ margin: 20, width: 500 }} textAlign='center'>
                <Segment raised >
                    <Header as='h2' color='teal' textAlign='center' dividing>
                        Product History {productHistory.length ? ": " + this.props.orderId : null}
                    </Header>
                    <Step.Group vertical>
                        {
                            productHistory.length ?
                                productHistory.map(item => <ProductHistoryStep
                                    orderType={item.orderType}
                                    orderDate={item.orderDate}
                                    orderId={item.orderId}
                                    orgName={item.orgName} />)
                                : <h3>No Product History Found</h3>
                        }
                    </Step.Group>
                </Segment>
            </Container>

        )
    }
}

