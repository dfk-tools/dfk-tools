import { createContext } from 'react';
import { AppContextData } from './AppContext.types';

const initialData: AppContextData = {
    initializing: true
};

const AppContext = createContext<{
    data: AppContextData;
}>({ data: initialData });

export default AppContext;
