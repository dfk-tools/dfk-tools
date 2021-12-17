import { Scatter } from '@ant-design/charts';
import { AbiCoder } from '@harmony-js/contract';
import BigNumber from 'bignumber.js';
import keccak from 'keccak';
import React, {
    useEffect,
    useState
} from 'react';
import { QuestCoreV2 } from '~blockchain/contracts';
import { getTransactionReceipt } from '~blockchain/hmyv2';
import Transaction from '~types/Transaction';
import getContractNameFromAddress from '~utilities/getContractNameFromAddress';
import { QuestChartProps } from './QuestChart.types';

const abiKeccakByEvent: Record<string, any> = {};
QuestCoreV2.abi.filter(o => o.type === 'event').forEach(event => {
    const abiMethod = `${event.name}(${event.inputs.map(input => input.type).join(',')})`;
    const abiMethodKeccak = keccak('keccak256').update(abiMethod).digest('hex');
    abiKeccakByEvent[abiMethod] = abiMethodKeccak.toLowerCase();
});
const abiEvents = Object.keys(abiKeccakByEvent);
const abiKeccaks = Object.values(abiKeccakByEvent);

const abiCoder = AbiCoder();

type QuestChartData = {
    datetime: string;
    to: string;
    value: string;
}[];

function QuestChart(props: QuestChartProps): JSX.Element {
    const [data, setData] = useState<QuestChartData>([]);
    const [dataFetching, setDataFetching] = useState<boolean>(false);

    useEffect(() => {
        if (props.transactions) getData(props.transactions);
    }, [props.transactions]);

    async function getData(_transactions: Transaction[]) {
        if (!dataFetching) {
            setDataFetching(true);
            try {
                const _data = await Promise.all(_transactions.map(async (transaction, i) => {
                    if (i === 0) {
                        console.log(abiKeccakByEvent);
                        console.log(transaction);
                        const receipt = await getTransactionReceipt(transaction.hash);
                        console.log(receipt);
                        receipt.result.logs.forEach(log => {
                            const logTopic0 = log.topics[0].toLowerCase();
                            console.log(logTopic0);
                        });
                    }

                    const timestamp = new Date(0);
                    timestamp.setUTCSeconds(transaction.timestamp);

                    return {
                        datetime: timestamp.toLocaleString(),
                        to: getContractNameFromAddress(transaction.to) || transaction.to,
                        value: new BigNumber(transaction.value).div(1e+18).toFixed(2)
                    };
                }));

                setData(_data);
            } catch (e) {
                console.log(e);
            }
            setDataFetching(false);
        }
    }

    return (
        <div>
            <Scatter
                data={data}
                loading={dataFetching}
                colorField="to"
                xField="datetime"
                yField="value"
            />
        </div>
    )
}

export default QuestChart;
