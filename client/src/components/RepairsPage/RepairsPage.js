import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql, gql } from 'react-apollo';
import { Route, Switch, withRouter } from 'react-router-dom';

import RepairsList from './RepairsList';
import RepairForm from './RepairForm';

const RepairsPage = ({
    allRepairsQuery, createRepairMutation, updateRepairMutation, deleteRepairMutation,
    completeRepairMutation, approveRepairMutation, mine, history,
}) => {
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

    const onCancel = () => {
        history.push('/repairs');
    };

    const onUpdate = async ({ id, title, scheduledTo, assignedTo, status }) => {
        if (id) {
            await updateRepairMutation({
                variables: {
                    id,
                    title,
                    scheduledTo,
                    assignedTo,
                    status,
                },
                update: (store, { data: { updateRepair } }) => {
                    const data = store.readQuery({ query: ALL_REPAIRS_QUERY });

                    const repair = data.allRepairs.find(r => r.id === id);
                    repair.title = updateRepair.repair.title;
                    repair.scheduledTo = updateRepair.repair.scheduledTo;
                    repair.assignedTo = updateRepair.repair.assignedTo;
                    repair.status = updateRepair.repair.status;

                    store.writeQuery({ query: ALL_REPAIRS_QUERY, data });
                },
            });
        } else {
            await createRepairMutation({
                variables: {
                    title,
                    scheduledTo,
                    assignedTo,
                    status,
                },
                update: (store, { data: { createRepair } }) => {
                    const data = store.readQuery({ query: ALL_REPAIRS_QUERY });

                    data.allRepairs.splice(0, 0, createRepair.repair);

                    store.writeQuery({ query: ALL_REPAIRS_QUERY, data });
                },
            });
        }
        onCancel();
    };

    const onDelete = async (id) => {
        await deleteRepairMutation({
            variables: {
                id,
            },
            update: (store) => {
                const data = store.readQuery({ query: ALL_REPAIRS_QUERY });

                data.allRepairs = data.allRepairs.filter(r => r.id !== id);

                store.writeQuery({ query: ALL_REPAIRS_QUERY, data });
            },
        });
        onCancel();
    };

    const onComplete = async (id) => {
        return completeRepairMutation({
            variables: {
                id,
            },
            update: (store, { data: { completeRepair } }) => {
                const data = store.readQuery({ query: ALL_REPAIRS_QUERY });

                const repair = data.allRepairs.find(r => r.id === id);
                repair.status = completeRepair.repair.status;

                store.writeQuery({ query: ALL_REPAIRS_QUERY, data });
            },
        });
    };

    const onApprove = async (id) => {
        return approveRepairMutation({
            variables: {
                id,
            },
            update: (store, { data: { approveRepair } }) => {
                const data = store.readQuery({ query: ALL_REPAIRS_QUERY });

                const repair = data.allRepairs.find(r => r.id === id);
                repair.status = approveRepair.repair.status;

                store.writeQuery({ query: ALL_REPAIRS_QUERY, data });
            },
        });
    };

    return (
        <div>
            <Switch>
                <Route
                    path="/repairs/create"
                    exact
                    render={
                        () => (
                            <RepairForm
                                repair={null}
                                users={allRepairsQuery.allUsers}
                                onUpdate={onUpdate}
                                onCancel={onCancel}
                            />
                        )
                    }
                />
                <Route
                    path="/repairs/:repairId"
                    render={
                        ({ match: { params } }) => (
                            <RepairForm
                                repair={
                                    allRepairsQuery.allRepairs.find(r => r.id === params.repairId)
                                }
                                users={allRepairsQuery.allUsers}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                                onCancel={onCancel}
                            />
                        )
                    }
                />
                <Route
                    render={
                        () => (
                            <RepairsList
                                repairs={repairs}
                                me={allRepairsQuery.me}
                                onComplete={onComplete}
                                onApprove={onApprove}
                            />
                        )
                    }
                />
            </Switch>
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
            status
            scheduledTo
            assignedTo {
                id
                name
            }
        }
        allUsers {
            id
            name
        }
        me {
            id
            isAdmin
        }
    }
`;

const CREATE_REPAIR_MUTATION = gql`
    mutation CreateRepairMutation($title: String!, $status: Status!, $scheduledTo: DateTime!, $assignedTo: ID) {
        createRepair(input: { title: $title, status: $status, scheduledTo: $scheduledTo, assignedTo: { id: $assignedTo } }) {
            repair {
                id
                title
                status
                scheduledTo
                assignedTo {
                    id
                    name
                }
            }
        }
    }
`;

const UPDATE_REPAIR_MUTATION = gql`
    mutation UpdateRepairMutation($id: ID!, $title: String!, $status: Status!, $scheduledTo: DateTime!, $assignedTo: ID) {
        updateRepair(input: { id: $id, title: $title, status: $status, scheduledTo: $scheduledTo, assignedTo: { id: $assignedTo } }) {
            repair {
                id
                title
                status
                scheduledTo
                assignedTo {
                    id
                    name
                }
            }
        }
    }
`;

const DELETE_REPAIR_MUTATION = gql`
    mutation DeleteRepairMutation($id: ID!) {
        deleteRepair(input: { id: $id }) {
            id
        }
    }
`;

const COMPLETE_REPAIR_MUTATION = gql`
    mutation CompleteRepairMutation($id: ID!) {
        completeRepair(input: { id: $id }) {
            repair {
                id
                status
            }
        }
    }
`;

const APPROVE_REPAIR_MUTATION = gql`
    mutation ApproveRepairMutation($id: ID!) {
        approveRepair(input: { id: $id }) {
            repair {
                id
                status
            }
        }
    }
`;

export default compose(
    graphql(ALL_REPAIRS_QUERY, { name: 'allRepairsQuery' }),
    graphql(CREATE_REPAIR_MUTATION, { name: 'createRepairMutation' }),
    graphql(UPDATE_REPAIR_MUTATION, { name: 'updateRepairMutation' }),
    graphql(DELETE_REPAIR_MUTATION, { name: 'deleteRepairMutation' }),
    graphql(COMPLETE_REPAIR_MUTATION, { name: 'completeRepairMutation' }),
    graphql(APPROVE_REPAIR_MUTATION, { name: 'approveRepairMutation' }),
)(withRouter(RepairsPage));
