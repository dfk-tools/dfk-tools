import { fromBech32 } from '@harmony-js/crypto';
import { isBech32Address } from '@harmony-js/utils';
import contracts from '~blockchain/contracts';

const contractKeys = Object.keys(contracts);

function getContractNameFromAddress(address: string): string | undefined {
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

export default getContractNameFromAddress;
