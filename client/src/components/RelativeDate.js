import React from 'react';
import PropTypes from 'prop-types';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import parse from 'date-fns/parse';

const RelativeDate = ({ date }) => {
    const parsed = parse(date);
    return (
        <span title={parsed.toLocaleString()}>
            {distanceInWordsToNow(parsed, { addSuffix: true })}
        </span>
    );
};

RelativeDate.propTypes = {
    date: PropTypes.string.isRequired,
};

export default RelativeDate;
