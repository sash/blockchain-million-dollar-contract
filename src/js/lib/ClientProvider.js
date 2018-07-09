import ethers from 'ethers';

var providers = ethers.providers;

// Connect to Ropsten (the test network)

// You may specify any of:
// - boolean; true = ropsten, false = homestead
// - object; { name: 'ropsten', chainId: 3 } (see ethers.networks);
// - string; e.g. 'homestead', 'ropsten', 'rinkeby', 'kovan'
var network = providers.networks.ropsten;

// Connect to INFUA
var infuraProvider = new providers.InfuraProvider(network);

// Connect to Etherscan
var etherscanProvider = new providers.EtherscanProvider(network);



// // Connect to a local Parity instance
// var provider = new providers.JsonRpcProvider('http://localhost:8545', network);
var fallbackProvider;
// Connect to an injected Web3's provider (e.g. MetaMask)
if (typeof web3 !== 'undefined'){
    var web3Provider = new providers.Web3Provider(web3.currentProvider, network);
    fallbackProvider = new providers.FallbackProvider([
        web3Provider,
        infuraProvider,
        etherscanProvider
    ]);

} else {
    fallbackProvider = new providers.FallbackProvider([
        infuraProvider,
        etherscanProvider
    ]);
    var web3Provider = null;
}

class ClientProvider{
    constructor(provider, web3Provider){
        this.provider = provider;
        this.web3Provider = web3Provider;

        if (this.isEthersEnabledBrowser()){
            this.watchMetamaskInterval = setInterval(this.watchMetamask.bind(this), 200);
        }
    }

    isEthersEnabledBrowser(){
        return this.web3Provider != null;
    }

    accountIsLocked(){
        return this.currentAccount == null;
    }

    onMetamaskAccountChange(callback){
        window.document.addEventListener('metamaskAccountChanged', function (customEvent) {
            callback(customEvent);
        });
    }



    async watchMetamask(){
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0){
            if (this.currentAccount !== accounts[0]){
                this.currentAccount = accounts[0];
                window.document.dispatchEvent(new CustomEvent('metamaskAccountChanged', {'detail': {'account': this.currentAccount}}));
            }
        } else {

            if (this.currentAccount){
                this.currentAccount = null;
                window.document.dispatchEvent(new CustomEvent('metamaskAccountChanged', {'detail': {'account': this.currentAccount}}));
            }
        }
    }
    async getBalance(){
        if (!this.currentAccount){
            return null;
        }
        const balance = await this.provider.getBalance(this.currentAccount);
        return ethers.utils.formatEther(balance);
    }
}

export default new ClientProvider(fallbackProvider, web3Provider);