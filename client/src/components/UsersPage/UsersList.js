import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, Menu, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const UsersList = ({ users }) => {
    return (
        <div>
            <Menu>
                <Menu.Item>
                    <Input placeholder="Name" />
                </Menu.Item>
                <Menu.Item>
                    <Input placeholder="Username" />
                </Menu.Item>
                <Menu.Item name="manager" active onClick={() => console.log('manager')} />
            </Menu>

            <Table compact celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Username</Table.HeaderCell>
                        <Table.HeaderCell>Manager</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        users.map(
                            user => (
                                <Table.Row key={user.id}>
                                    <Table.Cell>{user.name}</Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {
                                            user.isAdmin ?
                                                <Icon color="green" name="checkmark" size="large" />
                                                :
                                                null
                                        }
                                    </Table.Cell>
                                    <Table.Cell selectable>
                                        <Link to={`/users/${user.id}`}>Edit</Link>
                                    </Table.Cell>
                                </Table.Row>
                            ),
                        )
                    }
                </Table.Body>

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan="4">
                            <Button as={Link} icon labelPosition="left" primary size="small" to="/users/create">
                                <Icon name="user" /> Add User
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    );
};

UsersList.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string,
            username: PropTypes.string.isRequired,
        }).isRequired,
    ).isRequired,
};

export default UsersList;
