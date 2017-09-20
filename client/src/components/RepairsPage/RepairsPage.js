import React from 'react';
import PropTypes from 'prop-types';
import { Input, Menu } from 'semantic-ui-react';

import RepairsList from './RepairsList';

const RepairsPage = ({ }) => {
    const repairs = [];

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

};

export default RepairsPage;
