import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const ICON_FOR_STATUS = {
    COMPLETED: 'check circle outline',
    APPROVED: 'check circle',
    PENDING: 'wait',
};

export const repairIcon = (repair) => {
    return ICON_FOR_STATUS[repair.status] || 'question';
};

const RepairStatusIcon = ({ repair }) => {
    return (
        <Icon name={repairIcon(repair)} />
    );
};

RepairStatusIcon.propTypes = {
    repair: PropTypes.shape({
        status: PropTypes.string.isRequired,
    }).isRequired,
};

export default RepairStatusIcon;
