import List from 'antd/lib/list';
import Typography from 'antd/lib/typography';
import React, {
    useContext,
    useEffect,
    useState
} from 'react';
import AccountsContext from '~context/Accounts/AccountsContext';
import ProviderContext from '~context/Provider/ProviderContext';
import harmony from '~blockchain/harmony';
import { HeroListProps } from './HeroList.types';

function HeroList(props: HeroListProps): JSX.Element {
    

    return (
        <List
            {...props}
        />
    );
}

export default HeroList;
