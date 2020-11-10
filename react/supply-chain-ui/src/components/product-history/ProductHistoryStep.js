import React, { Component } from 'react'
import { Step, Icon, Card } from 'semantic-ui-react'
import AccessRequestModal from './AccessRequestModal'

export default class ProductHistoryStep extends Component {


    render() {
        return (

            <Step completed>
                <Card>
                    <Card.Content>
                        <Icon name={this.props.iconName} className='lable-right-align' />
                        <Card.Header>{this.props.orderType}</Card.Header>
                        <Card.Meta>{this.props.orderDate}</Card.Meta>
                        <Card.Description> <strong>{this.props.orgName}</strong>  </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <AccessRequestModal orgName={this.props.orgName} orderId={this.props.orderId} className="ui fluid button" basic color='teal' />
                    </Card.Content>
                </Card>
            </Step>
        )
    }
}
