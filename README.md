# blockchain-million-finney-dapp
http://www.milliondollarhomepage.com clone on the blockchain


# DApp
1. Viewer
1.1. Zoomable
1.2. Display linked content on hover + address of the boyer. Click to go to the linked content
1.3 Visualize free boxs with alternative background and make it clickable - go to the buy process

2. Buy
2.1. Choose starting grid position
2.2. Type in the message (limited by the available space)
2.3. Choose a file to upload to ipfs (or privide a hash if you already uploaded one - for example if you want to have a website linked)
2.4. Choose colour.

3. Preview the purchase (checkout)
3.1. Preview the grid after your purchase
3.2. Format transaction to purchase the space. Use single transaction even if you want to buy more boxes!



# Install
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

Take it for a spin:
1. Purchase a new block of boxes by selecting it
2. Publish content (use the ipfs PFD as attachment)

Look at che contact:
1. The storage: ...
2. The methods: buy, purchase, purchaseBlock, and the debug only read
3. The events: BoxBought, BoxPurchased


# TODO
√ Use \t as separator for the batch publish
√ Extract IPFS interaction into separate component
√ Publish the website on IPFS
* Test remove each event for buying and replace with a single event and watch the gas cost (if it goes down significantly)
* Run the coverage test again and generate the report to be ready for view
* Refactor the view component to separate out the logic from the views