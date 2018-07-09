import ethers from 'ethers';
import definition from '../../../build/contracts/MFC.json';

import ClientProvider from './ClientProvider';


class SmartContract{
    constructor(clientProvider){
        this.provider = clientProvider;
        this.contractReadOnly = new ethers.Contract(definition.networks["3"].address, definition.abi, this.provider.provider);
        if (this.provider.isEthersEnabledBrowser()){
            this.contractWrite = new ethers.Contract(definition.networks["3"].address, definition.abi, this.provider.web3Provider);
        }
    }
}


export default new SmartContract(ClientProvider);