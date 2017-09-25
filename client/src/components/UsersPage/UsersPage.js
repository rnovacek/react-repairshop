import React from 'react';
import PropTypes from 'prop-types';
import { gql, graphql, compose } from 'react-apollo';
import { Route, Switch, withRouter } from 'react-router-dom';

import UsersList from './UsersList';
import UserForm from './UserForm';

const UsersPage = ({
    allUsersQuery, updateUserMutation, createUserMutation, deleteUserMutation, history,
}) => {
    if (allUsersQuery && allUsersQuery.loading) {
        return <div>Loading</div>;
    }
    if (allUsersQuery && allUsersQuery.error) {
        console.error(allUsersQuery.error);
        return <div>Error</div>;
    }

    const onCancel = () => {
        history.push('/users');
    };

    const onUpdate = async ({ id, name, username, password, isAdmin }) => {
        if (id) {
            await updateUserMutation({
                variables: {
                    id,
                    name,
                    username,
                    password,
                    isAdmin,
                },
                update: (store, { data: { updateUser } }) => {
                    const data = store.readQuery({ query: ALL_USERS_QUERY });

                    const user = data.allUsers.find(u => u.id === id);
                    user.name = updateUser.user.name;
                    user.username = updateUser.user.username;
                    user.isAdmin = updateUser.user.isAdmin;

                    store.writeQuery({ query: ALL_USERS_QUERY, data });
                },
            });
        } else {
            await createUserMutation({
                variables: {
                    name,
                    username,
                    password,
                    isAdmin,
                },
                update: (store, { data: { createUser } }) => {
                    const data = store.readQuery({ query: ALL_USERS_QUERY });

                    data.allUsers.splice(0, 0, createUser.user);

                    store.writeQuery({ query: ALL_USERS_QUERY, data });
                },
            });
        }
        onCancel();
    };

    const onDelete = async (id) => {
        await deleteUserMutation({
            variables: {
                id,
            },
            update: (store, { data: { deleteUser } }) => {
                const data = store.readQuery({ query: ALL_USERS_QUERY });

                data.allUsers = data.allUsers.filter(u => u.id !== id);

                store.writeQuery({ query: ALL_USERS_QUERY, data });
            },
        });
        onCancel();
    };

    return (
        <div>
            <Switch>
                <Route
                    path="/users/create"
                    exact
                    render={
                        () => (
                            <UserForm
                                user={null}
                                onUpdate={onUpdate}
                                onCancel={onCancel}
                            />
                        )
                    }
                />
                <Route
                    path="/users/:userId"
                    render={
                        ({ match: { params } }) => (
                            <UserForm
                                user={allUsersQuery.allUsers.find(u => u.id === params.userId)}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                                onCancel={onCancel}
                            />
                        )
                    }
                />
            </Switch>
            <Route
                path="/users"
                exact
                render={
                    () => <UsersList users={allUsersQuery.allUsers} />
                }
            />
        </div>
    );
};

UsersPage.propTypes = {
    allUsersQuery: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.object,
        allUsers: PropTypes.array,
        me: PropTypes.shape({
            id: PropTypes.string.isRequired,
            isAdmin: PropTypes.bool.isRequired,
        }),
    }).isRequired,
    updateUserMutation: PropTypes.func.isRequired,
    createUserMutation: PropTypes.func.isRequired,
    deleteUserMutation: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
};

const ALL_USERS_QUERY = gql`
    query AllUsersQuery {
        allUsers {
            id
            name
            username
            isAdmin
        }
        me {
            id
            isAdmin
        }
    }
`;

const CREATE_USER_MUTATION = gql`
    mutation CreateUserMutation($name: String!, $username: String!, $password: String!, $isAdmin: Boolean!) {
        createUser(input: { name: $name, username: $username, password: $password, isAdmin: $isAdmin }) {
            user {
                id
                name
                username
                isAdmin
            }
        }
    }
`;

const UPDATE_USER_MUTATION = gql`
    mutation UpdateUserMutation($id: ID!, $name: String, $username: String, $password: String, $isAdmin: Boolean!) {
        updateUser(input: { id: $id, name: $name, username: $username, password: $password, isAdmin: $isAdmin }) {
            user {
                id
                name
                username
                isAdmin
            }
        }
    }
`;

const DELETE_USER_MUTATION = gql`
    mutation DeleteUserMutation($id: ID!) {
        deleteUser(input: { id: $id }) {
            id
        }
    }
`;

export default compose(
    graphql(ALL_USERS_QUERY, { name: 'allUsersQuery' }),
    graphql(CREATE_USER_MUTATION, { name: 'createUserMutation' }),
    graphql(UPDATE_USER_MUTATION, { name: 'updateUserMutation' }),
    graphql(DELETE_USER_MUTATION, { name: 'deleteUserMutation' }),
)(withRouter(UsersPage));
