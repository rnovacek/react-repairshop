import React from 'react';
import PropTypes from 'prop-types';
import { Container, Menu } from 'semantic-ui-react';
import { Route, withRouter } from 'react-router-dom';

import RepairsPage from './RepairsPage';
import UsersPage from './UsersPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const App = ({ location, history }) => {
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

                    <Menu.Item
                        name="All Repairs"
                        active={location.pathname === '/repairs'}
                        onClick={() => history.push('/repairs')}
                    />

                    <Menu.Item
                        name="Users"
                        active={location.pathname === '/users'}
                        onClick={() => history.push('/users')}
                    />
                </Container>
            </Menu>

            <Container text style={{ marginTop: '4em' }}>
                <Route path="/" exact render={() => <RepairsPage mine />} />
                <Route path="/repairs" exact render={() => <RepairsPage />} />
                <Route path="/users" render={() => <UsersPage />} />
                <Route path="/login" render={() => <LoginPage />} />
                <Route path="/register" render={() => <RegisterPage />} />
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
};

export default withRouter(App);
