import DownOutlined from '@ant-design/icons/DownOutlined';
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Image from 'antd/lib/image';
import Menu from 'antd/lib/menu';
import Space from 'antd/lib/space';
import Typography from 'antd/lib/typography';
import classnames from 'classnames';
import React, {
    useContext,
    useEffect,
    useState
} from 'react';
import {
    useHistory,
    useLocation
} from 'react-router-dom';
import logo from '~assets/logo.png';
import requestAccounts from '~blockchain/requestAccounts';
import StatusIndicator from '~components/StatusIndicator';
import AccountsContext from '~context/Accounts';
import ProviderContext from '~context/Provider';
import Style from './Navbar.module.less';

type MenuItemKeys = 'home' | 'heroes' | 'transactions';

function Navbar(): JSX.Element {
    const history = useHistory();
    const location = useLocation();

    const { data: provider } = useContext(ProviderContext);
    const { data: accounts, set: setAccounts } = useContext(AccountsContext);

    const [selectedKey, setSelectedKey] = useState<MenuItemKeys>();
    const [fetchingAccounts, setFetchingAccounts] = useState<boolean>(false);

    useEffect(() => {
        if (location.pathname === '/' || (location.pathname.charAt(0) === '/' && location.pathname.charAt(1) === '?')) setSelectedKey('home');
        else if (location.pathname.includes('/heroes')) setSelectedKey('heroes');
        else if (location.pathname.includes('/transactions')) setSelectedKey('transactions');
    }, [location.pathname]);

    useEffect(handleRequestAccounts, [provider])

    return (
        <div className={Style.navbar}>
            <div className={Style.navbarBrand}>
                <Image
                    preview={false}
                    src={logo}
                    height={32}
                />
                <Typography.Text strong={true}>
                    DFK Tools
                </Typography.Text>
            </div>
            <Menu
                className={Style.navbarMenu}
                mode="horizontal"
                selectedKeys={selectedKey ? [selectedKey] : []}
                theme="light"
            >
                <Menu.Item
                    className={Style.navbarMenuItem}
                    key="home"
                    onClick={() => history.push('/')}
                >
                    Home
                </Menu.Item>
                <Menu.Item
                    className={Style.navbarMenuItem}
                    key="heroes"
                    onClick={() => history.push('/heroes')}
                >
                    Heroes
                </Menu.Item>
                <Menu.Item
                    className={Style.navbarMenuItem}
                    key="transactions"
                    onClick={() => history.push('/transactions')}
                >
                    Transactions
                </Menu.Item>
                {!accounts || accounts.length === 0 ? (
                    <Menu.Item
                        className={classnames(Style.navbarMenuItem, Style.navbarMenuItemWallet)}
                        key="connect"
                    >
                        <Button
                            disabled={!provider || !setAccounts}
                            loading={fetchingAccounts}
                            shape="round"
                            type="primary"
                            onClick={handleRequestAccounts}
                        >
                            Connect
                        </Button>
                    </Menu.Item>
                ) : (
                    /*<Menu.SubMenu
                        className={classnames(Style.navbarMenuItem, Style.navbarMenuItemWallet)}
                        key="wallet"
                        title="Wallet"
                    >
                        <Menu.Item
                            key="test"
                        >
                            Test
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            key="disconnect"
                        >
                            Disconnect
                        </Menu.Item>
                    </Menu.SubMenu>*/
                    <Menu.Item
                        className={Style.navbarMenuItem}
                        key="wallet"
                        style={{ marginLeft: 'auto' }}
                    >
                        <Dropdown
                            overlay={(
                                <Menu>
                                    <Menu.Item
                                        key="disconnect"
                                    >
                                        Disconnect
                                    </Menu.Item>
                                </Menu>
                            )}
                        >
                            <Button
                                style={{ borderRadius: '8px' }}
                                type="default"
                            >
                                <Space
                                    align="center"
                                    style={{ position: 'relative', top: '-1px' }}
                                >
                                    <StatusIndicator
                                        pulse={true}
                                        style={{ marginRight: '2px' }}
                                    />
                                    <Typography.Text>
                                        {(accounts[0] as string).substr(0, 5)}...{(accounts[0] as string).substr((accounts[0] as string).length - 5, (accounts[0] as string).length - 1)}
                                    </Typography.Text>
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </Menu.Item>
                )}
            </Menu>
        </div>
    );

    function handleRequestAccounts() {
        if (!fetchingAccounts && provider && setAccounts) {
            setFetchingAccounts(true);
            requestAccounts(provider)
                .then((_accounts: unknown[]) => setAccounts(_accounts))
                .catch((e: unknown) => console.error(e))
                .finally(() => setFetchingAccounts(false));
        }
    }
}

export default Navbar;
