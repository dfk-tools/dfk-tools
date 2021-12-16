import { HTMLProps } from 'react';

export interface StatusIndicatorProps extends Omit<HTMLProps<HTMLDivElement>, 'children'> {
    pulse?: boolean;
}
