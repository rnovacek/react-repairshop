import React from 'react';
import PropTypes from 'prop-types';
import { Container, Icon, Loader, Menu, Message } from 'semantic-ui-react';
import { Route, withRouter } from 'react-router-dom';
import { gql, graphql } from 'react-apollo';

import RepairsPage from './RepairsPage';
import UsersPage from './UsersPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const App = ({ location, history, meQuery }) => {
    const logout = () => {
        localStorage.clear();
        meQuery.refetch();
        history.push(`/login?next=${location.pathname}`);
    };

    const login = () => {
        history.push(`/login?next=${location.pathname}`);
    };

    const onLogin = async (token) => {
        localStorage.token = token;

        const params = new URLSearchParams(location.search);
        let next = params.get('next') || '/';
        if (next === '/login') {
            next = '/';
        }
        await meQuery.refetch();
        history.push(next);
    };

    if (meQuery.loading) {
        return <Container><Loader /></Container>;
    }

    const user = meQuery.me;

    return (
        <div>
            <Menu fixed="top" inverted pointing>
                <Container>
                    <Menu.Item as="a" href="/" header>
                        Repair Shop
                    </Menu.Item>

                    <Menu.Item
                        name="My Repairs"
                        active={location.pathname === '/'}
                        onClick={() => history.push('/')}
                    />

                    {
                        user && user.isAdmin ?
                            <Menu.Item
                                name="All Repairs"
                                active={location.pathname === '/repairs'}
                                onClick={() => history.push('/repairs')}
                            />
                            :
                            null
                    }

                    {
                        user && user.isAdmin ?
                            <Menu.Item
                                name="Users"
                                active={location.pathname === '/users'}
                                onClick={() => history.push('/users')}
                            />
                            :
                            null
                    }

                    <Menu.Menu position="right">
                        {user && <Menu.Item><Icon name="user" />{user.name}</Menu.Item>}

                        {
                            user ?
                                <Menu.Item
                                    onClick={logout}
                                >
                                    <Icon name="power" />
                                    Logout
                                </Menu.Item>
                                :
                                <Menu.Item
                                    name="Log in"
                                    onClick={login}
                                />
                        }
                    </Menu.Menu>
                </Container>
            </Menu>

            <Container text style={{ marginTop: '4em' }}>
                {meQuery.error && <Message negative>Unable to fetch user info</Message>}
                <Route path="/" exact render={() => <RepairsPage mine />} />
                <Route path="/repairs" render={() => <RepairsPage />} />
                <Route path="/users" render={() => <UsersPage />} />
                <Route path="/login" render={() => <LoginPage onLogin={onLogin} />} />
                <Route path="/register" render={() => <RegisterPage onLogin={onLogin} />} />
            </Container>
        </div>
    );
};

App.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    meQuery: PropTypes.shape({
        me: PropTypes.shape({
            name: PropTypes.string,
        }),
        loading: PropTypes.bool.isRequired,
        error: PropTypes.object,
        refetch: PropTypes.func.isRequired,
    }).isRequired,
};

const ME_QUERY = gql`
    query MeQuery {
        me {
            id
            name
            isAdmin
        }
    }
`;

export default graphql(ME_QUERY, { name: 'meQuery' })(withRouter(App));
