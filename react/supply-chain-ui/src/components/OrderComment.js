import React, { Component } from 'react'
import { Comment } from 'semantic-ui-react'
import Moment from 'react-moment';


export default class OrderComment extends Component {
    constructor() {
        super()
        this.state = {
            avatart1: "https://react.semantic-ui.com/images/avatar/small/joe.jpg",
            avatart2: "https://react.semantic-ui.com/images/avatar/small/christian.jpg"
        }
    }
    render() {
        return (
            <div>
                <Comment.Group>
                    <Comment>
                        <Comment.Avatar src={this.props.avatar === 1 ? this.state.avatart1 : this.state.avatart2} />
                        <Comment.Content>
                            <Comment.Author>{this.props.userName} from {this.props.orgName}</Comment.Author>
                            <Comment.Metadata>
                                <div>
                                    <Moment format="LLL">
                                        {this.props.date}
                                    </Moment>
                                </div>
                            </Comment.Metadata>
                            <Comment.Text>
                                <p>
                                    {this.props.comment}
                                </p>
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                </Comment.Group>
            </div>
        )
    }
}
