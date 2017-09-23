import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Icon, Input, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import RepairCard from './RepairCard';

const RepairsList = ({ repairs, me, onComplete, onApprove }) => {
    return (
        <div>
            <Menu>
                <Menu.Item>
                    <Input placeholder="Date" />
                </Menu.Item>
                <Menu.Item>
                    <Input placeholder="Time" />
                </Menu.Item>
                <Menu.Item name="pending" active onClick={() => console.log('pending')} />
                <Menu.Item name="complete" active={false} onClick={() => console.log('complete')} />
            </Menu>

            <Button as={Link} icon labelPosition="left" primary size="small" to="/repairs/create">
                <Icon name="wrench" /> Add Repair
            </Button>

            <Card.Group itemsPerRow={3}>
                {
                    repairs.map(
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
        </div>
    );
};

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
