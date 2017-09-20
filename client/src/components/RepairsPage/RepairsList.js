import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';

import RepairCard from './RepairCard';

const RepairsList = ({ repairs }) => {
    return (
        <Card.Group>
            {repairs.map(repair => <RepairCard key={repair.id} repair={repair} />)}
        </Card.Group>
    );
};

RepairsList.propTypes = {
    repairs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    ).isRequired,
};

export default RepairsList;
