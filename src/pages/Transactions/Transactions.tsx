import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import { Generator, Report } from '@dfk-tools/transaction-history-report-generator';
import { contracts } from '@dfk-tools/transaction-history-report-generator/consts';
import { fromBech32 } from '@harmony-js/crypto';
import { isAddress, isBech32Address } from '@harmony-js/utils';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Col from 'antd/lib/col';
import Dropdown from 'antd/lib/dropdown';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Menu from 'antd/lib/menu';
import PageHeader from 'antd/lib/page-header';
import Popover from 'antd/lib/popover';
import Radio from 'antd/lib/radio';
import Result from 'antd/lib/result';
import Row from 'antd/lib/row';
import Select from 'antd/lib/select';
import Space from 'antd/lib/space';
import Statistic from 'antd/lib/statistic';
import Table from 'antd/lib/table';
import Tabs from 'antd/lib/tabs';
import Typography from 'antd/lib/typography';
import BigNumber from 'bignumber.js';
import React, {
    useEffect,
    useState
} from 'react';
import { RouteComponentProps } from 'react-router-dom';

type GeneratorFormValues = {
    player: string
};

const contractKeys = Object.keys(contracts);

function Transactions(props: RouteComponentProps): JSX.Element {
    const [generator, setGenerator] = useState<Generator>(new Generator());
    const [generatorForm] = Form.useForm<GeneratorFormValues>();
    const [generatorFormValues, setGeneratorFormValues] = useState<GeneratorFormValues>({
        player: ''
    });

    const [report, setReport] = useState<Report>();
    const [reportGenerating, setReportGenerating] = useState<boolean>(false);

    useEffect(() => {
        const playerIsBech32Address = isBech32Address(generatorFormValues.player);
        const playerIsChecksumAddress = isAddress(generatorFormValues.player);
        if (playerIsBech32Address || playerIsChecksumAddress) generateReport(generatorFormValues.player);
    }, [generatorFormValues.player]);

    async function generateReport(player: string) {
        if (!reportGenerating) {
            setReportGenerating(true);
            try {
                const generatorReport = await generator.report(player);
                setReport(generatorReport);
            } catch (e) {
                console.error(e);
            }
            setReportGenerating(false);
        }
    }

    let transactionStatistics: {
        sumValue: string;
        mostFrequentTo: string | undefined;
    } | undefined = undefined;
    if (report && report.transactions.length > 0) {
        const transactionsTo = report.transactions.map(o => o.to);
        transactionStatistics = {
            sumValue: report.transactions
                .map(o => new BigNumber(o.value).div(1e+18))
                .reduce((pv, cv) => pv.plus(cv)).toFixed(2),
            mostFrequentTo: transactionsTo
                .sort((a, b) =>
                    transactionsTo.filter(t => t === a).length -
                    transactionsTo.filter(t => t === b).length
                ).pop()
        }
    }

    return (
        <div className="container">
            <Card
                extra={(
                    <Dropdown
                        overlay={(
                            <Menu>
                                <Menu.Item
                                    key="exportAsCsv"
                                    onClick={() => {
                                        if (report) report.exportAsCsv('data.csv');
                                    }}
                                >
                                    Export as .csv
                                </Menu.Item>
                            </Menu>
                        )}
                        overlayStyle={{ borderRadius: '8px' }}
                    >
                        <Button
                            icon={<DownloadOutlined />}
                            shape="circle"
                            type="primary"
                        />
                    </Dropdown>
                )}
                style={{ borderRadius: '8px' }}
                title={(
                    <PageHeader
                        className="p-0"
                        title="Transactions"
                    />
                )}
            >
                <Form
                    colon={false}
                    form={generatorForm}
                    initialValues={generatorFormValues}
                    onValuesChange={(_, values) => setGeneratorFormValues(values)}
                >
                    <Row
                        align="middle"
                        gutter={10}
                    >
                        <Col flex="auto">
                            <Form.Item
                                name="player"
                                style={{ marginBottom: '0' }}
                            >
                                <Input
                                    disabled={reportGenerating}
                                    placeholder="Enter the Bech32 or Ethereum-style address of a player"
                                    size="large"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <Tabs>
                    <Tabs.TabPane
                        disabled={!report || reportGenerating}
                        key="data"
                        tab="Data"
                    >
                        <Table
                            columns={[
                                {
                                    dataIndex: 'timestamp',
                                    defaultSortOrder: 'descend',
                                    fixed: 'left',
                                    key: 'timestamp',
                                    render: value => {
                                        const date = new Date(0);
                                        date.setUTCSeconds(value);
                                        return date.toLocaleString();
                                    },
                                    sorter: {
                                        compare: (a, b) => {
                                            const aValue = new Date(a.timestamp).valueOf();
                                            const bValue = new Date(b.timestamp).valueOf();
                                            return aValue - bValue;
                                        }
                                    },
                                    title: getLabelFromTransactionKey('timestamp'),
                                    width: 220
                                },
                                {
                                    dataIndex: 'hash',
                                    ellipsis: true,
                                    key: 'hash',
                                    render: value => (
                                        <Typography.Link href={getExplorerUrl(value, 'tx')} target="_blank">
                                            {value}
                                        </Typography.Link>
                                    ),
                                    title: getLabelFromTransactionKey('hash'),
                                    width: 200
                                },
                                /*
                                {
                                    dataIndex: 'from',
                                    ellipsis: true,
                                    key: 'from',
                                    render: value => (
                                        <Typography.Link href={getExplorerUrl(value, 'address')} target="_blank">
                                            {value}
                                        </Typography.Link>
                                    ),
                                    title: getLabelFromTransactionKey('from'),
                                    width: 200
                                },
                                */
                                {
                                    dataIndex: 'to',
                                    ellipsis: true,
                                    key: 'to',
                                    render: value => {
                                        const checksum = isBech32Address(value) ? fromBech32(value) : value;
                                        const contract = getContractNameFromAddress(checksum);

                                        return (
                                            <Typography.Link href={getExplorerUrl(value, 'address')} target="_blank">
                                                {contract || value}
                                            </Typography.Link>
                                        )
                                    },
                                    title: getLabelFromTransactionKey('to'),
                                    width: 200
                                },
                                {
                                    dataIndex: 'value',
                                    key: 'value',
                                    render: value => {
                                        const bn = new BigNumber(value).div(1e+18);
                                        return `${bn.toFixed(bn.decimalPlaces() === 0 ? 0 : 2)} ONE`;
                                    },
                                    sorter: {
                                        compare: (a, b) => {
                                            const bnA = new BigNumber(a.value);
                                            const bnB = new BigNumber(b.value);
                                            return bnA.minus(bnB).isPositive() ? 1 : -1;
                                        }
                                    },
                                    title: getLabelFromTransactionKey('value'),
                                    width: 200
                                },
                                {
                                    dataIndex: 'gas',
                                    key: 'gas',
                                    title: getLabelFromTransactionKey('gas'),
                                    width: 150
                                },
                                {
                                    dataIndex: 'gasPrice',
                                    key: 'gasPrice',
                                    render: value => {
                                        const bn = new BigNumber(value).div(1e+18);
                                        return `${bn.toString(10)} ONE`;
                                    },
                                    title: getLabelFromTransactionKey('gasPrice'),
                                    width: 200
                                },
                                {
                                    dataIndex: 'blockHash',
                                    ellipsis: true,
                                    key: 'blockHash',
                                    title: getLabelFromTransactionKey('blockHash'),
                                    width: 200
                                },
                                {
                                    dataIndex: 'blockNumber',
                                    key: 'blockNumber',
                                    title: getLabelFromTransactionKey('blockNumber'),
                                    width: 200
                                },
                                {
                                    dataIndex: 'ethHash',
                                    ellipsis: true,
                                    key: 'ethHash',
                                    title: getLabelFromTransactionKey('ethHash'),
                                    width: 200
                                },
                                {
                                    dataIndex: 'transactionIndex',
                                    key: 'transactionIndex',
                                    title: getLabelFromTransactionKey('transactionIndex'),
                                    width: 150
                                },
                                {
                                    dataIndex: 'input',
                                    ellipsis: true,
                                    key: 'input',
                                    title: getLabelFromTransactionKey('input'),
                                    width: 100
                                },
                                {
                                    dataIndex: 'nonce',
                                    key: 'nonce',
                                    title: getLabelFromTransactionKey('nonce'),
                                    width: 100
                                },
                                {
                                    dataIndex: 'shardID',
                                    filters: [
                                        { text: 'Shard 0', value: 0 },
                                        { text: 'Shard 1', value: 1 },
                                        { text: 'Shard 2', value: 2 },
                                        { text: 'Shard 3', value: 3 }
                                    ],
                                    key: 'shardID',
                                    title: getLabelFromTransactionKey('shardID'),
                                    width: 150,
                                    onFilter: (value, record) => record.shardID === value
                                },
                                {
                                    dataIndex: 'toShardID',
                                    filters: [
                                        { text: 'Shard 0', value: 0 },
                                        { text: 'Shard 1', value: 1 },
                                        { text: 'Shard 2', value: 2 },
                                        { text: 'Shard 3', value: 3 }
                                    ],
                                    key: 'toShardID',
                                    title: getLabelFromTransactionKey('toShardID'),
                                    width: 150,
                                    onFilter: (value, record) => record.toShardID === value
                                },
                                /*
                                {
                                    dataIndex: 'r',
                                    ellipsis: true,
                                    key: 'r',
                                    title: 'R',
                                    width: 100
                                },
                                {
                                    dataIndex: 's',
                                    ellipsis: true,
                                    key: 's',
                                    title: 'S',
                                    width: 100
                                },
                                {
                                    dataIndex: 'v',
                                    ellipsis: true,
                                    key: 'v',
                                    title: 'V',
                                    width: 100
                                }
                                */
                            ]}
                            dataSource={report?.transactions}
                            loading={reportGenerating}
                            pagination={{
                                showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} items`
                            }}
                            rowKey={row => row.hash}
                            scroll={{ y: 300 }}
                            showSorterTooltip={false}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        disabled={!report || reportGenerating}
                        key="statistics"
                        tab="Statistics"
                    >
                        {transactionStatistics && (
                            <Row
                                align="middle"
                                gutter={10}
                            >
                                <Col xs={24} sm={12}>
                                    <Statistic
                                        suffix="ONE"
                                        title="Total ONE transacted"
                                        value={transactionStatistics.sumValue}
                                    />
                                </Col>
                                {transactionStatistics.mostFrequentTo && (
                                    <Col xs={24} sm={12}>
                                        <Statistic
                                            title="Interacted most with"
                                            value={getContractNameFromAddress(transactionStatistics.mostFrequentTo) || transactionStatistics.mostFrequentTo}
                                        />
                                    </Col>
                                )}
                            </Row>
                        )}
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
}

function getLabelFromTransactionKey(key: string): string {
    switch (key) {
        case 'timestamp':
            return 'Timestamp';
        case 'hash':
            return 'Hash';
        case 'from':
            return 'From';
        case 'to':
            return 'To';
        case 'shardID':
            return 'From Shard ID';
        case 'toShardID':
            return 'To Shard ID';
        case 'value':
            return 'Value';
        case 'gas':
            return 'Gas Limit';
        case 'gasPrice':
            return 'Gas Price';
        case 'blockHash':
            return 'Block Hash';
        case 'blockNumber':
            return 'Block Number';
        case 'ethHash':
            return 'Eth Hash';
        case 'transactionIndex':
            return 'Transaction Index';
        case 'input':
            return 'Input';
        case 'nonce':
            return 'Nonce';
        case 'r':
            return 'R';
        case 's':
            return 'S';
        case 'v':
            return 'V';
        default:
            return 'N/A';
    }
}

function getContractNameFromAddress(address: string) {
    const checksum = isBech32Address(address) ? fromBech32(address) : address;
    let contractName: string | undefined = undefined;
    contractKeys.forEach(contractKey => {
        const contractValue = contracts[contractKey as keyof typeof contracts];
        const contractChecksum = isBech32Address(contractValue) ? fromBech32(contractValue) : contractValue;
        if (checksum === contractChecksum) {
            contractName = contractKey;
            return;
        }
    });
    return contractName;
}

function getExplorerUrl(value: string, prefix?: string) {
    return `https://explorer.harmony.one/${prefix ? `${prefix}/` : ''}${value}`;
}

export default Transactions;
