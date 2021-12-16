import { createContext } from 'react';

const AccountsContext = createContext<{
    data?: unknown[];
    set?: (accounts?: unknown[]) => void
}>({});

export default AccountsContext;
