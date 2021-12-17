import { fromBech32 } from '@harmony-js/crypto';
import { isBech32Address } from '@harmony-js/utils';
import axios from 'axios';
import Transaction from '~types/Transaction';

// These methods are not available via the @harmony-js/core package and thus need to be called directly

const rpc = process.env.HARMONY_RPC_URL;

export type getTransactionsHistoryFilters = {
    page?: number;
    pageSize?: number;
    type?: 'ALL' | 'SENT' | 'RECEIVED';
    order?: 'ASC' | 'DESC';
}

export type getTransactionsHistoryResponse = {
    jsonrpc: '2.0',
    id: '1',
    result: {
        transactions: Transaction[];
    }
};
export async function getTransactionsHistory(
    address: string,
    filters?: getTransactionsHistoryFilters
): Promise<getTransactionsHistoryResponse> {
    const checksumAddress = isBech32Address(address) ? fromBech32(address) : address;
    const data = {
        jsonrpc: '2.0',
        id: '1',
        method: 'hmyv2_getTransactionsHistory',
        params: [{
            address: checksumAddress,
            pageIndex: filters?.page || 0,
            pageSize: filters?.pageSize || 100000,
            fullTx: true,
            txType: filters?.type || 'ALL',
            order: filters?.order
        }]
    };

    const response = await axios.post(rpc, data);

    if (response.status === 200 && response.data) {
        const data = response.data as getTransactionsHistoryResponse;
        return data;
    } else throw new Error();
}

export type getTransactionReceiptResponse = {
    id: '1';
    jsonrpc: '2.0';
    result: {
        blockHash: string;
        blockNumber: string;
        contractAddress?: string;
        cumulativeGasUsed: number;
        from: string;
        gasUsed: number;
        logs: {
            address: string;
            blockHash: string;
            blockNumber: string;
            data: string;
            logIndex: string;
            removed: boolean;
            topics: string[];
            transactionHash: string;
            transactionIndex: string;
        }[];
        logsBloom: string;
        to?: string;
        transactionHash: string;
        transactionIndex: string;
    }
}

export async function getTransactionReceipt(hash: string): Promise<getTransactionReceiptResponse> {
    const data = {
        jsonrpc: '2.0',
        id: '1',
        method: 'hmyv2_getTransactionReceipt',
        params: [hash]
    };

    const response = await axios.post(rpc, data);

    if (response.status === 200 && response.data) {
        const data = response.data as getTransactionReceiptResponse;
        return data;
    } else throw new Error();
}
