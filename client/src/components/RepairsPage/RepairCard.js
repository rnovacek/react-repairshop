import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'semantic-ui-react';
import parse from 'date-fns/parse';
import { Link } from 'react-router-dom';

import RepairStatusIcon from './RepairStatusIcon';

const RepairCardStatus = ({ repair, me, onComplete, onApprove }) => {
    if (repair.status === 'PENDING') {
        if ((repair.assignedTo && repair.assignedTo.id === me.id) || me.isAdmin) {
            return (
                <Button
                    basic
                    onClick={(e) => {
                        onComplete(repair.id);
                        e.preventDefault();
                    }}
                >
                    Mark as complete
                </Button>
            );
        }
        return <span>Pending</span>;
    } else if (repair.status === 'COMPLETED') {
        if (me.isAdmin) {
            return (
                <Button
                    basic
                    onClick={(e) => {
                        onApprove(repair.id);
                        e.preventDefault();
                    }}
                >
                    Approve
                </Button>
            );
        }
        return <span>Completed</span>;
    }
    return <span>Approved</span>;
};

RepairCardStatus.propTypes = {
    repair: PropTypes.shape({
        status: PropTypes.string.isRequired,
    }).isRequired,
    me: PropTypes.shape({
        id: PropTypes.string.isRequired,
        isAdmin: PropTypes.bool.isRequired,
    }).isRequired,
    onComplete: PropTypes.func.isRequired,
    onApprove: PropTypes.func.isRequired,
};

const RepairCard = ({ repair, me, onComplete, onApprove }) => {
    return (
        <Card as={Link} to={`/repairs/${repair.id}`}>
            <Card.Content>
                <Card.Header>
                    <RepairStatusIcon repair={repair} />
                    {repair.title}
                </Card.Header>
                <Card.Meta>
                    {repair.assignedTo ? repair.assignedTo.name : '---'}
                </Card.Meta>
                <Card.Description>
                    {parse(repair.scheduledTo).toLocaleString()}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <RepairCardStatus
                    repair={repair}
                    me={me}
                    onComplete={onComplete}
                    onApprove={onApprove}
                />
            </Card.Content>
            <Card.Content extra>
                {repair.comments.length} comments
            </Card.Content>
        </Card>
    );
};

RepairCard.propTypes = {
    repair: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        scheduledTo: PropTypes.string.isRequired,
        assignedTo: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
        status: PropTypes.string,
    }).isRequired,
    me: PropTypes.shape({
        id: PropTypes.string.isRequired,
        isAdmin: PropTypes.bool.isRequired,
    }).isRequired,
    onComplete: PropTypes.func.isRequired,
    onApprove: PropTypes.func.isRequired,
};

export default RepairCard;
