import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'semantic-ui-react';

import CommentsList from './CommentsList';
import RepairForm from './RepairForm';

const RepairDetails = ({ repair, users, onUpdate, onDelete, onCancel, onAddComment }) => {
    return (
        <div>
            <RepairForm
                repair={repair}
                users={users}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onCancel={onCancel}
            />

            <Divider hidden />

            {
                onAddComment ?
                    <CommentsList repair={repair} onAddComment={onAddComment} />
                    :
                    null
            }
        </div>
    );
};

RepairDetails.propTypes = {
    repair: PropTypes.object,
    users: PropTypes.array.isRequired,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    onAddComment: PropTypes.func,
};

RepairDetails.defaultProps = {
    onUpdate: null,
    onDelete: null,
    onAddComment: null,
};

export default RepairDetails;
