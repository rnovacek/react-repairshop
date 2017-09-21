import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, Message } from 'semantic-ui-react';
import { gql, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

class RegisterPage extends React.Component {
    state = {
        name: '',
        username: '',
        password: '',
        error: null,
    };

    onRegister = async () => {
        const { name, username, password, error } = this.state;
        if (error) {
            this.setState({
                error: null,
            });
        }

        const response = await this.props.registerMutation({
            variables: {
                name,
                username,
                password,
            },
        });
        if (!response.data.register.token) {
            this.setState({
                error: 'Registration failed',
            });
        } else {
            this.props.onLogin(response.data.register.token);
        }
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
                        label="Name"
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })}
                    />
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
                    <Button type="submit" onClick={this.onRegister}>Register</Button>
                </Form>
            </Container>
        );
    }
}

RegisterPage.propTypes = {
    registerMutation: PropTypes.func.isRequired,
    location: PropTypes.shape({
        search: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    onLogin: PropTypes.func.isRequired,
};

const REGISTER_MUTATION = gql`
    mutation RegisterMutation($name: String!, $username: String!, $password: String!) {
        register(input: { name: $name, username: $username, password: $password }) {
            token
        }
    }
`;

export default graphql(REGISTER_MUTATION, { name: 'registerMutation' })(withRouter(RegisterPage));
