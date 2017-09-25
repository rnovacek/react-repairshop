import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';

const TIMES = [[], [], []];
const COLUMNS = 3;

const formatTime = (time) => {
    if (time === null) {
        return '';
    }
    return time < 10 ? `0${time}:00` : `${time}:00`;
};

for (let i = 0; i < 24; i += 1) {
    TIMES[Math.trunc(i / (24 / COLUMNS))].push({
        text: formatTime(i),
        value: i,
    });
}

class TimePicker extends React.Component {
    onTimeSelect = (time) => {
        if (this.props.focusedInput === 'startTime') {
            this.props.onFocusChange('endTime');
            this.props.onTimesChange({
                startTime: time,
                endTime: this.props.endTime,
            });
        } else {
            this.props.onFocusChange(null);
            this.props.onTimesChange({
                startTime: this.props.startTime,
                endTime: time,
            });
        }
    };

    render() {
        const { startTime, endTime } = this.props;
        return (
            <Popup
                open={this.props.focusedInput !== null}
                onClose={() => this.props.onFocusChange(null)}
                onOpen={() => this.props.onFocusChange('startTime')}
                trigger={
                    <div className="time-select">
                        <input placeholder="Start Time" value={formatTime(startTime)} readOnly />
                        <div className="time-arrow">
                            <svg viewBox="0 0 1000 1000">
                                <path
                                    d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"
                                />
                            </svg>
                        </div>
                        <input placeholder="End Time" value={formatTime(endTime)} readOnly />
                    </div>
                }
                content={
                    <div style={{ display: 'flex' }}>
                        {
                            TIMES.map(
                                times => (
                                    <div style={{ flexGrow: 1 }} key={times[0].text}>
                                        <Button.Group vertical>
                                            {
                                                times.map(
                                                    time => (
                                                        <Button
                                                            basic
                                                            key={time.text}
                                                            primary={this.startTime && time.value > this.startTime && this.endTime && time.value < this.endTime}
                                                            // primary={this.state.time === time.text}
                                                            onClick={() => this.onTimeSelect(time.value)}
                                                        >
                                                            {time.text}
                                                        </Button>
                                                    ),
                                                )
                                            }
                                        </Button.Group>
                                    </div>
                                ),
                            )
                        }
                    </div>
                }
                on="click"
                position="bottom center"
            />
        );
    }
}

TimePicker.propTypes = {};

export default TimePicker;
