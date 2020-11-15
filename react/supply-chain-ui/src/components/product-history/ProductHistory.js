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
            if (list) {
                this.setState(this.setState({ productHistory: this.state.productHistory.concat(list.productHistory) }))
            }
        })
    }

    render() {
        const { productHistory } = this.state
        return (
            <Container style={{ margin: 20, width: 500 }} textAlign='center'>
                <Segment raised >
                    <Header as='h2' color='teal' textAlign='center' dividing>
                        Product History {productHistory.length ? ": " + this.props.orderId : null}
                    </Header>
                    <Step.Group vertical>
                        {
                            productHistory !== null && productHistory.length !== 0 ?
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

