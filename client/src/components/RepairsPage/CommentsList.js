import React from 'react';
import PropTypes from 'prop-types';
import { Button, Message, Table, TextArea } from 'semantic-ui-react';

import RelativeDate from '../RelativeDate';

class CommentsList extends React.Component {
    state = {
        body: '',
        saving: false,
        error: null,
    };

    onAddComment = async () => {
        this.setState({
            saving: true,
            error: null,
        });
        try {
            await this.props.onAddComment(this.props.repair.id, this.state.body);
        } catch (e) {
            this.setState({
                error: e.toString(),
            });
        } finally {
            this.setState({
                saving: false,
                body: '',
            });
        }
    };

    render() {
        const { repair } = this.props;

        return (
            <div>
                {
                    this.state.error ?
                        <Message negative>{this.state.error}</Message>
                        :
                        null
                }
                <Table compact celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan={3}>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            repair.comments.length > 0 ?
                                repair.comments.map(
                                    comment => (
                                        <Table.Row key={comment.id}>
                                            <Table.Cell collapsing>
                                                {comment.author.name}
                                            </Table.Cell>
                                            <Table.Cell style={{ whiteSpace: 'pre' }}>
                                                {comment.body}
                                            </Table.Cell>
                                            <Table.Cell collapsing>
                                                <RelativeDate date={comment.createdAt} />
                                            </Table.Cell>
                                        </Table.Row>
                                    ),
                                )
                                :
                                <Table.Row>
                                    <Table.Cell colSpan={3}>
                                        <Message>No comment for this repair.</Message>
                                    </Table.Cell>
                                </Table.Row>
                        }
                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell>
                                <TextArea
                                    style={{ width: '100%' }}
                                    value={this.state.body}
                                    onChange={e => this.setState({ body: e.target.value })}
                                />
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <Button
                                    onClick={this.onAddComment}
                                >
                                    Add comment
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        );
    }
}

CommentsList.propTypes = {
    repair: PropTypes.shape({
        id: PropTypes.string.isRequired,
        comments: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                author: PropTypes.shape({
                    name: PropTypes.string.isRequired,
                }).isRequired,
                body: PropTypes.string.isRequired,
                createdAt: PropTypes.string.isRequired,
            }).isRequired,
        ).isRequired,
    }).isRequired,
    onAddComment: PropTypes.func.isRequired,
};

export default CommentsList;
