import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Divider, Icon, Menu, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { DateRangePicker } from 'react-dates';

import RepairCard from './RepairCard';
import TimePicker from '../TimePicker';
import moment from 'moment';

class RepairsList extends React.Component {
    state = {
        startDate: null,
        endDate: null,
        focusedDateRange: null,
        focusedTimeRange: null,
        startTime: null,
        endTime: null,
        assignedTo: null,
        statuses: ['PENDING', 'COMPLETED'],
    };

    toggleStatus = (status) => {
        if (this.state.statuses.includes(status)) {
            this.setState({
                statuses: this.state.statuses.filter(s => s !== status),
            });
        } else {
            this.setState({
                statuses: [
                    ...this.state.statuses,
                    status,
                ],
            });
        }
    };

    filterRepair = (repair) => {
        const { statuses, startDate, endDate, startTime, endTime } = this.state;

        if (statuses.length > 0 && !statuses.includes(repair.status)) {
            return false;
        }

        const scheduledTo = moment(repair.scheduledTo);
        if (startDate && endDate && !scheduledTo.isBetween(startDate, endDate)) {
            return false;
        }

        const hour = scheduledTo.hours();
        console.log('time', hour, startTime, endTime);
        if (startTime !== null && endTime !== null && !(hour >= startTime && hour < endTime)) {
            console.log('false')
            return false;
        }

        return true;
    };

    render() {
        const { repairs, me, onComplete, onApprove } = this.props;

        console.log('Time filter', this.state.startTime, this.state.endTime);
        console.log('Date filter', this.state.startDate, this.state.endDate);

        const filteredRepairs = repairs.filter(this.filterRepair);
        const sortedRepairs = filteredRepairs.sort(
            (r1, r2) => (Date.parse(r1.scheduledTo) - Date.parse(r2.scheduledTo)),
        );

        return (
            <div>
                <Menu borderless>
                    <Menu.Item>
                        <DateRangePicker
                            minimumNights={0}
                            numberOfMonths={1}
                            isOutsideRange={() => false}
                            isDayHighlighted={date => date.isSame(new Date(), 'day')}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onDatesChange={
                                ({ startDate, endDate }) => this.setState({
                                    startDate,
                                    endDate,
                                })
                            }
                            focusedInput={this.state.focusedDateRange}
                            onFocusChange={
                                focusedInput => this.setState({ focusedDateRange: focusedInput })
                            }
                        />
                    </Menu.Item>
                    <Menu.Item>
                        <TimePicker
                            startTime={this.state.startTime}
                            endTime={this.state.endTime}
                            onTimesChange={
                                ({ startTime, endTime }) => this.setState({
                                    startTime,
                                    endTime,
                                })
                            }
                            focusedInput={this.state.focusedTimeRange}
                            onFocusChange={
                                focusedInput => this.setState({ focusedTimeRange: focusedInput })
                            }
                        />
                    </Menu.Item>
                    <Menu.Item>
                        <Button.Group>
                            <Button
                                active={this.state.statuses.includes('PENDING')}
                                onClick={() => this.toggleStatus('PENDING')}
                            >
                                Pending
                            </Button>
                            <Button
                                active={this.state.statuses.includes('COMPLETED')}
                                onClick={() => this.toggleStatus('COMPLETED')}
                            >
                                Complete
                            </Button>
                            <Button
                                active={this.state.statuses.includes('APPROVED')}
                                onClick={() => this.toggleStatus('APPROVED')}
                            >
                                Approved
                            </Button>
                        </Button.Group>
                    </Menu.Item>
                </Menu>

                {
                    me.isAdmin ?
                        <Button as={Link} icon labelPosition="left" primary size="small" to="/repairs/create">
                            <Icon name="wrench" /> Add Repair
                        </Button>
                        :
                        null
                }

                <Divider hidden />

                {
                    sortedRepairs.length > 0 ?
                        <Card.Group itemsPerRow={3}>
                            {
                                sortedRepairs.map(
                                    repair => (
                                        <RepairCard
                                            key={repair.id}
                                            repair={repair}
                                            me={me}
                                            onComplete={onComplete}
                                            onApprove={onApprove}
                                        />
                                    ),
                                )
                            }
                        </Card.Group>
                        :
                        <Message>No repairs here</Message>
                }
            </div>
        );
    }
}

RepairsList.propTypes = {
    repairs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    ).isRequired,
    me: PropTypes.object.isRequired,
    onComplete: PropTypes.func.isRequired,
    onApprove: PropTypes.func.isRequired,
};

export default RepairsList;
