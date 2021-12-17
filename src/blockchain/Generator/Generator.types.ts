import {
    ChainID,
    ChainType
} from '@harmony-js/utils';

export type GeneratorOptions = {
    rpc: string;
    chainId: ChainID;
    chainType: ChainType;
}

export type GeneratorReportFilters = {
    /**
     * Set this to a known DFK contract to include only transactions that involved interactions with that contract.
     */
    contract?: string;

    /**
     * Set this to limit the number of transactions returned. Default is `100000`.
     */
    limit?: number;

    /**
     * Start date
     */
    start?: Date;

    /**
     * End date
     */
    end?: Date;
};
