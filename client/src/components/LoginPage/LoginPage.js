import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, Message } from 'semantic-ui-react';
import { gql, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

class LoginPage extends React.Component {
    state = {
        username: '',
        password: '',
        error: null,
    };

    onLogin = async () => {
        const { username, password, error } = this.state;
        if (error) {
            this.setState({
                error: null,
            });
        }

        const response = await this.props.loginMutation({
            variables: {
                username,
                password,
            },
        });
        if (!response.data.login.token) {
            this.setState({
                error: 'Invalid username or password',
            });
        } else {
            localStorage.token = response.data.login.token;
            const params = new URLSearchParams(this.props.location.search);
            const next = params.get('next') || '/';
            this.props.history.push(next);
        }
    };

    onRegister = () => {
        const params = new URLSearchParams(this.props.location.search);
        const next = params.get('next') || '/';
        this.props.history.push(`/register?next=${next}`);
    };

    render() {
        return (
            <Container>
                {
                    this.state.error ?
                        <Message negative>{this.state.error}</Message>
                        :
                        null
                }
                <Form>
                    <Form.Input
                        label="Username"
                        value={this.state.username}
                        onChange={e => this.setState({ username: e.target.value })}
                    />
                    <Form.Input
                        label="Password"
                        type="password"
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                    />
                    <Button type="submit" onClick={this.onLogin}>Log In</Button>
                    <Button onClick={this.onRegister}>Register</Button>
                </Form>
            </Container>
        );
    }
}

LoginPage.propTypes = {
    loginMutation: PropTypes.func.isRequired,
    location: PropTypes.shape({
        search: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
};

const LOGIN_MUTATION = gql`
    mutation LoginMutation($username: String!, $password: String!) {
        login(input: { username: $username, password: $password }) {
            token
        }
    }
`;

export default graphql(LOGIN_MUTATION, { name: 'loginMutation' })(withRouter(LoginPage));
