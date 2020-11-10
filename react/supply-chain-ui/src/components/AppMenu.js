import React, { Component } from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'

import { Link } from "react-router-dom";


export default class AppMenu extends Component {

    handleLogoutClick = () => {
        console.log("HI")
        console.log(localStorage.getItem('username', null))
        localStorage.setItem('username', null)
    }
    render() {

        return (
            <Menu stackable>
                <Menu.Item>
                    <img src='https://react.semantic-ui.com/logo.png' />
                </Menu.Item>

                <Dropdown text='Orders' pointing className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to='/createOrder'>Add new Order</Dropdown.Item>
                        <Dropdown.Item as={Link} to='/createdOrderList'>Orders created</Dropdown.Item>
                        <Dropdown.Item as={Link} to='/taggedOrderList'>Orders tagged in</Dropdown.Item>
                        <Dropdown.Item as={Link} to='/approveOrderList'>Orders to approve</Dropdown.Item>

                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown text='Product History' pointing className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to='/productHistory'>Get history</Dropdown.Item>
                        <Dropdown.Item as={Link} to='/accessRequestList'>Access Requests raised</Dropdown.Item>
                        <Dropdown.Item as={Link} to='/accessRequestToApproveList'>Requests to approve</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {localStorage.getItem('username', null) !== "null" ?
                    <Menu.Item
                        position='right'
                        name='logout'
                        onClick={this.handleLogoutClick}>
                        Logout
                     </Menu.Item>
                    : null}
            </Menu>
        )
    }
}
