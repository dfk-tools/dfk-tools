import { Harmony } from '@harmony-js/core';
import { fromBech32 } from '@harmony-js/crypto';
import {
    ChainID,
    ChainType
} from '@harmony-js/utils';
import Transaction from '~types/Transaction';
import contracts from '../contracts';
import { getTransactionsHistory } from '../hmyv2';
import { GeneratorOptions, GeneratorReportFilters } from './Generator.types';

const contractAddresses = Object.values(contracts);

const defaultOptions: GeneratorOptions = {
    rpc: 'https://api.harmony.one',
    chainId: ChainID.HmyMainnet,
    chainType: ChainType.Harmony
};

/**
 * EVM chain instance for collecting transaction histories and generating {@link Report reports}.
 */
class Generator {
    constructor(options?: Partial<GeneratorOptions>) {
        const _options: GeneratorOptions = {
            rpc: options?.rpc || defaultOptions.rpc,
            chainId: options?.chainId || defaultOptions.chainId,
            chainType: options?.chainType || defaultOptions.chainType
        };
        this.harmony = new Harmony(_options.rpc, {
            chainId: _options.chainId,
            chainType: _options.chainType
        });
        this.options = _options;
    }

    protected harmony: Harmony;
    protected readonly options: GeneratorOptions;

    /**
     * Generate a transaction history report for a player.
     * @param player Bech32/Checksum address of the player
     * @param filters Optional object to change how the transactions are retrieved
     * @param options Optional object to change how the report is generated
     * @returns A list of transactions
     */
    public async report(player: string, filters?: GeneratorReportFilters): Promise<Transaction[]> {
        const transactionsHistory = await getTransactionsHistory(player, {
            pageSize: filters?.limit
        });
        let transactions = transactionsHistory.result.transactions;

        // if start/end filters were passed in, ensure transactions get filtered in between
        const filtersStartValue = filters?.start?.valueOf();
        const filtersEndValue = filters?.end?.valueOf()
        if (filtersStartValue || filtersEndValue) {
            transactions = transactions.filter(transaction => {
                const date = new Date(transaction.timestamp);
                const dateValue = date.valueOf();
                if (filtersStartValue && dateValue < filtersStartValue) return false;
                if (filtersEndValue && dateValue > filtersEndValue) return false;
                return true;
            });
        }

        const filtersContract = filters?.contract;
        if (filtersContract) {
            // if the provided contract address is not one of the DFK contracts, throw an error
            if (!contractAddresses.includes(filtersContract)) throw new Error();

            transactions = transactions.filter(transaction => {
                const checksumTo = fromBech32(transaction.to);
                const checksumFrom = fromBech32(transaction.from);

                // if the sender AND receiver don't equal the provided contract address, exclude this transaction
                if (checksumTo !== filtersContract && checksumFrom !== filtersContract) return false;

                return true;
            });
        } else {
            // if the contract filter is not applied, then we still need to filter out all non-DFK transactions
            transactions = transactions.filter(transaction => {
                const checksumTo = fromBech32(transaction.to);
                const checksumFrom = fromBech32(transaction.from);

                // if the sender AND receiver is not one of the DFK contracts, exclude this transaction
                if (!contractAddresses.includes(checksumTo) && !contractAddresses.includes(checksumFrom)) return false;

                return true;
            });
        }

        return transactions;
    }
}

export default Generator;
