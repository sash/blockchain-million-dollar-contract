import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';
import ClientProvider from './lib/ClientProvider.js';
import SmartContract from './lib/SmartContract.js';

ReactDOM.render(<App provider={ClientProvider} account={ClientProvider.currentAccount} ethBrowser={ClientProvider.isEthersEnabledBrowser()}
                     contract={SmartContract}/>, document.getElementById("app"));

ClientProvider.onMetamaskAccountChange(() => {
    ReactDOM.render(<App provider={ClientProvider}
                         account={ClientProvider.currentAccount}
                         ethBrowser={ClientProvider.isEthersEnabledBrowser()}
                         contract={SmartContract}
    />, document.getElementById("app"))
});