import React from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Dropdown, Form, Input, Message, Step } from 'semantic-ui-react';
import moment from 'moment';
import { DayPickerSingleDateController } from 'react-dates';
import { addHours, areRangesOverlapping } from 'date-fns';

const TIMES = [[], [], []];

for (let i = 0; i < 24; i += 1) {
    const text = i < 10 ? `0${i}:00` : `${i}:00`;
    TIMES[Math.trunc(i / 8)].push({
        text,
        value: i,
    });
}

const overlappingWithRepair = (date, repairDate) => {
    return areRangesOverlapping(date, addHours(date, 1), repairDate, addHours(repairDate, 1));
};

class RepairForm extends React.Component {
    constructor(props) {
        super(props);

        const state = {
            error: null,
            updating: false,
            deleting: false,
            scheduledToFocused: false,
        };

        if (this.props.repair) {
            const scheduledTo = moment(props.repair.scheduledTo);
            this.state = {
                ...state,
                title: props.repair.title,
                status: props.repair.status,
                scheduledTo,
                time: scheduledTo.format('HH:mm'),
                assignedTo: props.repair.assignedTo ? props.repair.assignedTo.id : '-',
            };
        } else {
            const time = moment().add(1, 'hours').minutes(0);
            this.state = {
                ...state,
                title: '',
                scheduledTo: moment(),
                time: time.format('HH:mm'),
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
                scheduledTo: this.getSelectedTime().toISOString(),
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

    getSelectedTime = () => {
        const [hours, minutes] = this.state.time.split(':');
        const time = this.state.scheduledTo.clone();
        time.hours(hours).minutes(minutes).seconds(0).milliseconds(0);
        return time;
    };

    overlappingWithAnyRepair = (id, time) => {
        const [hours, minutes] = time.split(':');
        const date = this.state.scheduledTo.clone();
        date.hours(hours).minutes(minutes).seconds(0).milliseconds(0);
        return this.props.allRepairs.some(
            repair => repair.id !== id && overlappingWithRepair(date, repair.scheduledTo),
        );
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
                <Button content="Back" icon="left arrow" labelPosition="left" onClick={this.props.onCancel} />

                <Divider hidden />

                {
                    this.state.error ?
                        <Message negative>{this.state.error}</Message>
                        :
                        null
                }

                <Form.Field
                    control={Input}
                    disabled={!this.props.onUpdate}
                    label="Title"
                    placeholder="Title"
                    value={this.state.title}
                    onChange={e => this.setState({ title: e.target.value })}
                />

                <Form.Field>
                    <label>Scheduled to</label>
                    <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: '2rem' }}>
                            <DayPickerSingleDateController
                                date={this.state.scheduledTo}
                                onDateChange={date => this.setState({ scheduledTo: date })}
                                focused={this.state.scheduledToFocused}
                                onFocusChange={
                                    ({ focused }) => this.setState({ scheduledToFocused: focused })
                                }
                            />
                        </div>


                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Form.Field
                                control={Input}
                                disabled={!this.props.onUpdate}
                                value={this.state.time}
                                onChange={e => this.setState({ time: e.target.value })}
                            />

                            <div style={{ display: 'flex' }}>
                                {
                                    TIMES.map(
                                        times => (
                                            <div style={{ flexGrow: 1 }} key={times[0].text}>
                                                <Button.Group vertical>
                                                    {
                                                        times.map(
                                                            time => (
                                                                <Button
                                                                    basic
                                                                    disabled={this.overlappingWithAnyRepair(this.props.repair ? this.props.repair.id : null, time.text)}
                                                                    key={time.text}
                                                                    primary={this.state.time === time.text}
                                                                    onClick={
                                                                        () => this.setState({
                                                                            time: time.text,
                                                                        })
                                                                    }
                                                                >
                                                                    {time.text}
                                                                </Button>
                                                            ),
                                                        )
                                                    }
                                                </Button.Group>
                                            </div>
                                        ),
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </Form.Field>




                <Form.Field
                    control={Dropdown}
                    disabled={!this.props.onUpdate}
                    label="Assignee"
                    placeholder="Assignee"
                    fluid
                    search
                    selection
                    options={assignedToOptions}
                    value={this.state.assignedTo}
                    onChange={(e, data) => this.setState({ assignedTo: data.value })}
                />

                <Form.Field control={Step.Group} fluid size="tiny" disabled={!this.props.onUpdate}>
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

                {
                    this.props.onUpdate ?
                        <Button type="submit" onClick={this.onUpdate} loading={this.state.updating} primary>
                            {
                                this.props.repair ?
                                    'Update'
                                    :
                                    'Create'
                            }
                        </Button>
                        :
                        null
                }

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
        scheduledTo: PropTypes.string.isRequired,
        assignedTo: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
        status: PropTypes.string.isRequired,
    }),
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ).isRequired,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
};

RepairForm.defaultProps = {
    repair: null,
    onUpdate: null,
    onDelete: null,
};

export default RepairForm;
