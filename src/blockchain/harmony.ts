import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType } from '@harmony-js/utils';

const harmony = new Harmony(process.env.HARMONY_RPC_URL, {
    chainType: ChainType.Harmony,
    chainId: process.env.HARMONY_CHAIN_ID === 'testnet'
        ? ChainID.HmyTestnet
        : ChainID.HmyMainnet
});

export default harmony;
