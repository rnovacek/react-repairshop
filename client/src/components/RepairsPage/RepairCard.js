import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'semantic-ui-react';
import parse from 'date-fns/parse';

const RepairCard = ({ repair }) => {
    return (
        <Card>
            <Card.Content>
                <Card.Header>
                    {repair.title}
                </Card.Header>
                <Card.Meta>
                    {repair.assignedTo ? repair.assignedTo.name : null}
                </Card.Meta>
                <Card.Description>
                    {parse(repair.scheduledTo).toLocaleString()}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button basic>Mark as complete</Button>
            </Card.Content>
        </Card>
    );
};

RepairCard.propTypes = {
    repair: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        scheduledTo: PropTypes.string.isRequired,
        assignedTo: PropTypes.string,
    }).isRequired,
};

export default RepairCard;
