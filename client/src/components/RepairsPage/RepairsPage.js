import React from 'react';
import PropTypes from 'prop-types';
import { graphql, gql } from 'react-apollo';
import { Input, Menu } from 'semantic-ui-react';

import RepairsList from './RepairsList';

const RepairsPage = ({ allRepairsQuery, mine }) => {
    if (allRepairsQuery && allRepairsQuery.loading) {
        return <div>Loading</div>;
    }
    if (allRepairsQuery && allRepairsQuery.error) {
        console.error(allRepairsQuery.error);
        return <div>Error</div>;
    }

    const repairs = mine ?
        allRepairsQuery.allRepairs.filter(
            r => (r.assignedTo && r.assignedTo.id === allRepairsQuery.me.id),
        )
        :
        allRepairsQuery.allRepairs;

    return (
        <div>
            <Menu secondary>
                <Menu.Item>
                    <Input placeholder="Date" />
                </Menu.Item>
                <Menu.Item>
                    <Input placeholder="Time" />
                </Menu.Item>
                <Menu.Item name="pending" active onClick={() => console.log('pending')} />
                <Menu.Item name="complete" active={false} onClick={() => console.log('complete')} />
            </Menu>

            <RepairsList repairs={repairs} />
        </div>
    );
};

RepairsPage.propTypes = {
    allRepairsQuery: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.object,
        allRepairs: PropTypes.array,
        me: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }),
    }).isRequired,
    mine: PropTypes.bool.isRequired,
};

RepairsPage.defaultProps = {
    mine: false,
};

const ALL_REPAIRS_QUERY = gql`
    query AllRepairsQuery {
        allRepairs {
            id
            title
            scheduledTo
            assignedTo {
                name
            }
            completedAt
        }
        me {
            id
        }
    }
`;

export default graphql(ALL_REPAIRS_QUERY, { name: 'allRepairsQuery' })(RepairsPage);
