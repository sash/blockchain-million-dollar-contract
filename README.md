# Million Finney DApp
http://www.milliondollarhomepage.com clone on the blockchain

# Getting started
* [ ] Install [docker](https://www.docker.com/community-edition)
* [ ] Install node + yarn (a better npm alternative)
* [ ] Install truffle


* `docker-compose up -d`
* `yarn ipfs-cors`

* Get the private keys from ganache and import them into your metamask
    `docker-compose logs ganache | grep "(1)"`
* `truffle migrate` and copy the contract address to the config.js private address and then `yarn build` and if you want to publish it ot ipfs:
    - `yarn ipfs-publish`
    - `docker-compose exec ipfs ipfs name publish "HASH OF THE DIR"`
* open `localhost:8082` in your ethers enabled browser

# Demo

A clone of http://www.milliondollarhomepage.com/. 1000x1000 pixels for sale each worth $1. People can use it as advertisement space forever!

Instead of offering pixes, you buy boxes that you can control the color of and you can use a single UTF8 character in each box. You can also attach a file (stored on ipfs) that will be shown when the block is clicked.

## Take it for a spin:
1. Open chrome + safari. Leave the safari open to observe changes.
2. Purchase a new block of boxes by selecting it. The price of the block is set at 0.1 ether (in order for the autor to get 1M finney!). Look at the account of the contract author - it is credited!
3. Change to another account and to the same.
4. Lock your metamask.
5. Publish content (use PFD as attachment). The attachment is visible by everyone.

## Look at che contact:
1. The storage: array of Box structs representing the board. array of buyers
2. The methods: buy, publish, publishBatch, and the debug only read
3. The events: BoxBought, BoxPurchased used for creating the board in web

## What we have:
* 100% unit test code coverage of the contract. Open `coverage\index.html`
* Pure frontend app implemented in ReactJS, built with WebPack. Can be distributed via IPFS. Lets do that now!
* Ethers.js
* Metamask integration (no custom wallet)
* String manipulation (using strings lib)
* Optimizations: Colours are stored as `bytes3` and characters are stored as `bytes4`. Attachments are expected to be the same for many boxes, so they are optimized too.


## Known limitations:
* Publishing and buying large blocks runs out of gas. Buy can be refactored to store only the purchased blocks (instead of boxes). That will reduce the gas for buy.
* I had planned to use pure JS implementation of zip and allow for zipped static webpages to be published via the attachment. The concept will work.

## We are live!
Go to https://bit.ly/2L7Mo5y and buy your block of boxes on Ropsten now!

The contract source is validated can be reviewed at https://ropsten.etherscan.io/address/0xa10fbb3fbdf0fe9d40cc546d281a40b2679cdbdb#code

# Demo preparations
* `docker-compose restart` & copy private keys of ganache
* `truffle migrate` & copy contract address
* paste contract address in `src/js/config.js`
* `yarn build`
* `yarn ipfs-publish` & copy the hash to the URL `https://ipfs.io/ipfs/XXX`
* Open chrome & import the top 3 accounts
* Open safari for view-only comparison