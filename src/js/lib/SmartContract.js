import ethers from 'ethers';
// import definition from '../../../build/contracts/MFC.json';
import config from '../config'
import helpers from './helpers';

import ClientProvider from './ClientProvider';


class SmartContract{
    constructor(clientProvider){
        this.bought = []
        // this.currentAccountBought = []
        this.published = []
        this.provider = clientProvider;
        this.contractReadOnly = new ethers.Contract(config.MFC.address[config.network], config.MFC.abi, this.provider.provider);
        this.contractReadOnly.onboxbought = (x, y, buyer) => {
            this.loading = false;
            this.bought.push({x, y, buyer});
            window.document.dispatchEvent(new CustomEvent('mfcBoxBought', {'detail': {x, y, buyer}}));
        };
        // uint16 x, uint16 y, address owner, bytes4 char, bytes3 colour, string attachment
        this.contractReadOnly.onboxpublished = (x, y, owner, char, colour, attachment) => {
            this.loading = false;
            this.published.push({x, y, owner, char, colour, attachment});
            window.document.dispatchEvent(new CustomEvent('mfcBoxPublished', {'detail': {
                    x,
                    y,
                    owner,
                    char,
                    colour,
                    attachment
            }}));
        };
        this.loading = true;
        this.provider.provider.resetEventsBlock(config.MFC.block[config.network]); // replay all events from the contract creation.
        setTimeout(() => {
                this.loading = false;
                window.document.dispatchEvent(new CustomEvent('mfcBoxBought', {'detail': null}));
            }, 10000
        );

        if (this.provider.isEthersEnabledBrowser()){
            this.contractWrite = new ethers.Contract(config.MFC.address[config.network], config.MFC.abi, this.provider.web3Provider.getSigner());
        }

    }


    onBought(callback){
        window.document.addEventListener('mfcBoxBought', function (customEvent) {
            callback(customEvent);
        });
    }

    onPublished(callback) {
        window.document.addEventListener('mfcBoxPublished', function (customEvent) {
            callback(customEvent);
        });
    }

    async buy(x, y, length, height){
        // Move to contract
        let price = await this.contractReadOnly.BOX_PRICE();


        let tx = await this.contractWrite.buy(x, y, length, height, {
            value: price.mul(length * height),
            gasPrice: 1000000000,
        });
        return tx;

    }

    async publish(x, y, chars, colour, attachment){
        let tx;
        if (chars.length === 1){
            tx = await this.contractWrite.publish(x, y, helpers.toHex(chars), attachment, colour);
        } else {
            tx = await this.contractWrite.publishBatch(x, y, chars, attachment, colour);
        }
        return tx;
    }

    async boxPrice(){
        return await this.contractReadOnly.BOX_PRICE();
    }


}


export default new SmartContract(ClientProvider);