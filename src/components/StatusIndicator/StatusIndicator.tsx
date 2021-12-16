import classnames from 'classnames';
import React from 'react';
import { StatusIndicatorProps } from './StatusIndicator.types';
import Style from './StatusIndicator.module.less';

function StatusIndicator(props: StatusIndicatorProps): JSX.Element {
    return (
        <div
            {...({
                ...props,
                pulse: undefined
            })}
            className={classnames(Style.statusIndicator, props.className, {
                [Style.pulse]: 'trued'
            })}
        />
    );
}

export default StatusIndicator;
