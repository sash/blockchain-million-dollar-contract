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
            this.bought.push({x, y, buyer});
            window.document.dispatchEvent(new CustomEvent('mfcBoxBought', {'detail': {x, y, buyer}}));
        };
        // uint16 x, uint16 y, address owner, bytes4 char, bytes3 colour, string attachment
        this.contractReadOnly.onboxpublished = (x, y, owner, char, colour, attachment) => {
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
        this.provider.provider.resetEventsBlock(config.MFC.block[config.network]); // replay all events from the contract creation.

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


        try {

            let tx = await this.contractWrite.buy(x, y, length, height, {
                value: price.mul(length * height),
                gasPrice: 1000000000,
            });
            console.log(tx);
        } catch (e) {
            console.log(e);
        }
    }

    async publish(x, y, chars, colour, attachment){
        console.log(x, y, chars, colour, attachment)
        let tx;
        if (chars.length === 1){
            tx = await this.contractWrite.publish(x, y, helpers.toHex(chars), attachment, colour);
        } else {
            tx = await this.contractWrite.publishBlock(x, y, chars, attachment, colour);
        }
        console.log(tx);
    }


}


export default new SmartContract(ClientProvider);