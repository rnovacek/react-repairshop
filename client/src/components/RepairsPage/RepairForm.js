import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Form, Input, Message, Step } from 'semantic-ui-react';

class RepairForm extends React.Component {
    constructor(props) {
        super(props);

        const state = {
            error: null,
            updating: false,
            deleting: false,
        };

        if (this.props.repair) {
            this.state = {
                ...state,
                title: props.repair.title,
                status: props.repair.status,
                scheduledTo: props.repair.scheduledTo,
                assignedTo: props.repair.assignedTo ? props.repair.assignedTo.id : '-',
            };
        } else {
            this.state = {
                ...state,
                title: '',
                scheduledTo: (new Date()).toISOString(),
                assignedTo: '-',
                status: 'PENDING',
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
                id: this.props.repair ? this.props.repair.id : null,
                title: this.state.title,
                status: this.state.status,
                scheduledTo: this.state.scheduledTo,
                assignedTo: this.state.assignedTo !== '-' ? this.state.assignedTo : null,
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
            await this.props.onDelete(this.props.repair.id);
        } catch (e) {
            this.setState({
                deleting: false,
                error: e.toString(),
            });
        }
    };

    render() {
        const assignedToOptions = [
            {
                key: '-',
                value: '-',
                text: '---',
            },
            ...this.props.users.map(user => ({
                key: user.id,
                value: user.id,
                text: user.name,
            })),
        ];

        return (
            <Form>
                {
                    this.state.error ?
                        <Message negative>{this.state.error}</Message>
                        :
                        null
                }

                <Form.Field
                    control={Input}
                    label="Title"
                    placeholder="Title"
                    value={this.state.title}
                    onChange={e => this.setState({ title: e.target.value })}
                />

                <Form.Field
                    control={Input}
                    label="Scheduled to"
                    value={this.state.scheduledTo}
                    onChange={e => this.setState({ scheduledTo: e.target.value })}
                />

                <Form.Field
                    control={Dropdown}
                    label="Assignee"
                    placeholder="Assignee"
                    fluid
                    search
                    selection
                    options={assignedToOptions}
                    value={this.state.assignedTo}
                    onChange={(e, data) => this.setState({ assignedTo: data.value })}
                />

                <Form.Field control={Step.Group} fluid size="tiny">
                    <Step
                        icon="wait"
                        title="Pending"
                        active={this.state.status === 'PENDING'}
                        onClick={() => this.setState({ status: 'PENDING' })}
                    />

                    <Step
                        icon="check circle outline"
                        title="Completed"
                        active={this.state.status === 'COMPLETED'}
                        onClick={() => this.setState({ status: 'COMPLETED' })}
                    />

                    <Step
                        icon="check circle"
                        title="Approved"
                        active={this.state.status === 'APPROVED'}
                        onClick={() => this.setState({ status: 'APPROVED' })}
                    />
                </Form.Field>

                <Button type="submit" onClick={this.onUpdate} loading={this.state.updating} primary>
                    {
                        this.props.repair ?
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

RepairForm.propTypes = {
    repair: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        scheduledTo: PropTypes.instanceOf(Date).isRequired,
        assignedTo: PropTypes.string,
        completed: PropTypes.bool.isRequired,
        approved: PropTypes.bool.isRequired,
    }),
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ).isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
};

RepairForm.defaultProps = {
    repair: null,
    onDelete: null,
};

export default RepairForm;
