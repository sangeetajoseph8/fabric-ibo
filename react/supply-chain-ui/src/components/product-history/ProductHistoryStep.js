import React, { Component } from 'react'
import { Step, Icon, Button, Card } from 'semantic-ui-react'
import AccessRequestModal from './AccessRequestModal'

export default class ProductHistoryStep extends Component {


    render() {
        return (

            <Step completed>
                <Card>
                    <Card.Content>
                        <Icon name={this.props.iconName} className='lable-right-align' />
                        <Card.Header className='lable-left-align'>{this.props.orderType}</Card.Header>
                        <Card.Meta className='lable-left-align'>{this.props.orderDate}</Card.Meta>
                        <Card.Description className='lable-left-align'> <strong>{this.props.orgName}</strong>  </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <AccessRequestModal orgName={this.props.orgName} orderId={this.props.orderId} className="ui fluid button" basic color='teal' />
                    </Card.Content>
                </Card>
            </Step>
        )
    }
}
