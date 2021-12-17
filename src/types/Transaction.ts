type Transaction = {
    blockHash?: string;
    blockNumber?: number;
    ethHash?: string;
    from: string;
    gas: number;
    gasPrice: number;
    hash: string;
    input: string;
    nonce: number;
    r: string;
    s: string;
    shardID: number;
    timestamp: number;
    to: string;
    toShardID: number;
    transactionIndex: number;
    v: string;
    value: number;
};

export default Transaction;
