import detectEthereumProvider from '@metamask/detect-provider';
import ConfigProvider from 'antd/lib/config-provider';
import en_US from 'antd/lib/locale/en_US';
import Layout from 'antd/lib/layout';
import React, {
    lazy,
    Suspense,
    useEffect,
    useState
} from 'react';
import {
    BrowserRouter,
    Route,
    Switch
} from 'react-router-dom';
import Navbar from '~components/Navbar';
import Refblock from '~components/Refblock';
import AccountsContext from '~context/Accounts';
import AppContext from '~context/App';
import ProviderContext from '~context/Provider';

const Home = lazy(() => import('./pages/Home'));
const Heroes = lazy(() => import('./pages/Heroes'));
const Transactions = lazy(() => import('./pages/Transactions'));

function App(): JSX.Element {
    const [initializing, setInitializing] = useState<boolean>(true);

    const [accounts, setAccounts] = useState<unknown[]>();
    const [provider, setProvider] = useState<unknown>();

    useEffect(() => { initialize() }, [initializing]);

    async function initialize(): Promise<void> {
        if (initializing) {
            const provider = await detectEthereumProvider();
            if (provider !== window.ethereum) {
                console.error('Do you have multiple wallets installed?');
            }

            if (provider) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                provider.on('accountsChanged', accounts => {
                    console.log('Accounts changed!');
                    console.log(accounts);
                });

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                provider.on('chainIdChanged', chainId => {
                    console.log('Chain ID changed!');
                    console.log(chainId);
                })

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                provider.on('disconnect', () => {
                    console.log('Provider disconnected!');
                    setProvider(undefined);
                });

                setProvider(provider);
            } else {
                console.error('Metamask not found!');
            }

            setInitializing(false);
        }
    }

    return (
        <BrowserRouter>
            <ConfigProvider locale={en_US}>
                <AppContext.Provider value={{
                    data: {
                        initializing
                    }
                }}>
                    <ProviderContext.Provider value={{
                        data: provider,
                        set: (_provider) => setProvider(_provider)
                    }}>
                        <AccountsContext.Provider value={{
                            data: accounts,
                            set: (_accounts) => setAccounts(_accounts)
                        }}>
                            <Layout className="app">
                                <Layout.Header className="app-header">
                                    <Navbar />
                                </Layout.Header>
                                <Layout.Content className="app-content">
                                    <Suspense fallback="Loading...">
                                        <Switch>
                                            <Route exact={true} path="/" component={Home} />
                                            <Route exact={true} path="/heroes" component={Heroes} />
                                            <Route exact={true} path="/transactions" component={Transactions} />
                                        </Switch>
                                    </Suspense>
                                </Layout.Content>
                                <Layout.Footer className="app-footer">
                                    <Refblock />
                                </Layout.Footer>
                            </Layout>
                        </AccountsContext.Provider>
                    </ProviderContext.Provider>
                </AppContext.Provider>
            </ConfigProvider>
        </BrowserRouter>
    )
}

export default App;
