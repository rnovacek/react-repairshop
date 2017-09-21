import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message } from 'semantic-ui-react';

class UserForm extends React.Component {
    constructor(props) {
        super(props);

        const state = {
            password: '',
            error: null,
            updating: false,
            deleting: false,
        };

        if (this.props.user) {
            this.state = {
                ...state,
                name: this.props.user.name,
                username: this.props.user.username,
                isAdmin: this.props.user.isAdmin,
            };
        } else {
            this.state = {
                ...state,
                name: '',
                username: '',
                isAdmin: false,
                password: '',
            };
        }
    }

    onUpdate = async () => {
        this.setState({
            updating: true,
            error: null,
        });
        try {
            await this.props.onUpdate({
                id: this.props.user ? this.props.user.id : null,
                name: this.state.name,
                username: this.state.username,
                password: this.state.password,
                isAdmin: this.state.isAdmin,
            });
        } catch (e) {
            this.setState({
                updating: false,
                error: e.toString(),
            });
        }
    };

    onDelete = async () => {
        this.setState({
            deleting: true,
            error: null,
        });
        try {
            await this.props.onDelete(this.props.user.id);
        } catch (e) {
            this.setState({
                deleting: false,
                error: e.toString(),
            });
        }
    };

    render() {
        return (
            <Form>
                {
                    this.state.error ?
                        <Message negative>{this.state.error}</Message>
                        :
                        null
                }
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

                <Form.Checkbox
                    label="Manager"
                    toggle
                    checked={this.state.isAdmin}
                    onChange={() => this.setState({ isAdmin: !this.state.isAdmin })}
                />

                <Button type="submit" onClick={this.onUpdate} loading={this.state.updating} primary>
                    {
                        this.props.user ?
                            'Update'
                            :
                            'Create'
                    }
                </Button>

                <Button onClick={this.props.onCancel}>
                    Cancel
                </Button>

                {
                    this.props.onDelete ?
                        <Button onClick={this.onDelete} loading={this.state.deleting} negative floated="right">
                            Delete
                        </Button>
                        :
                        null
                }
            </Form>
        );
    }
}

UserForm.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        username: PropTypes.string.isRequired,
        isAdmin: PropTypes.bool.isRequired,
    }),
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
};

UserForm.defaultProps = {
    user: null,
    onDelete: null,
};

export default UserForm;
