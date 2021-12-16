import { ListProps } from 'antd/lib/list';

export interface HeroListProps<T = unknown> extends ListProps<T> {
    search?: {
        name?: string | string[];
        generation?: number | [number, number];
        owner?: string | string[];
    }
}
