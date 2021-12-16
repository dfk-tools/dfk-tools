import { createContext } from 'react';

const ProviderContext = createContext<{
    data?: unknown,
    set?: (provider?: unknown) => void
}>({});

export default ProviderContext;
