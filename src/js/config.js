/**
 *
 * @type {{network: string, MFC: {address: {private: string, ropsten: string}, block: {private: number, ropsten: number}, abi: *[]}, ipfs: {gateway: string, server: {host: string, port: number}}}}
 *
 * ganache_1   | (0) 0x36fbeff443a2fce1c77eee1136b348e608d86feaba6e84c89deabd428d7ee4aa
 ganache_1   | (1) 0x0d006710dc5de7e59583fd5c662fe5260a19075fce5cb55a9cd942699052429b
 ganache_1   | (2) 0xb2d3a39acff82ee75a3bcf2803a1a8699ff9cdfcccf0c3db6f004a7cca9781ca
 ganache_1   | (3) 0x6a0f5c3349c19e5ddea60428ae3dc09ae4c2612cb3a58fd8110731479be3f0d1
 ganache_1   | (4) 0x10a2192eca959e980c8ba81b1db5241196f78e829d80c3042c40d7222190d419
 ganache_1   | (5) 0x481ca18da7e9ba15a5b83558eaa12075dec10a0ad09fdce5f77d374a560ec119
 ganache_1   | (6) 0x43159c50405b7d219bbcdc22d4de66791de61956988111ca4d6e292b659ee84b
 ganache_1   | (7) 0xb28e0ba7c57f3fd70938aed75c104364d66773d6052fc74de84253783640c045
 ganache_1   | (8) 0x77317b1d24c6b5c1ee4d95c3ff054631367d140ff34938c844513c39cd92d23d
 ganache_1   | (9) 0x402ab048a7f96cfeba583a667a08a589c5e3d930e641e2050df8cdcdc2273031
 */
module.exports = {
    network: 'private',
    MFC:{
        address: {
            private: '0x042fca9b16745fe543ffbb01743c6247b1ac0739',
            ropsten: '0xaf7ca8d710b2304089c2265c44b5210a486a063b',
        },
        block: {
            private: 0,
            ropsten: 3610144,
        },
        abi: [
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "board",
                "outputs": [
                    {
                        "name": "char",
                        "type": "bytes4"
                    },
                    {
                        "name": "attachmentIndex",
                        "type": "uint256"
                    },
                    {
                        "name": "colour",
                        "type": "bytes3"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "BOX_PRICE",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "name": "_BOX_PRICE",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "x",
                        "type": "uint16"
                    },
                    {
                        "indexed": false,
                        "name": "y",
                        "type": "uint16"
                    },
                    {
                        "indexed": false,
                        "name": "buyer",
                        "type": "address"
                    }
                ],
                "name": "BoxBought",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "x",
                        "type": "uint16"
                    },
                    {
                        "indexed": false,
                        "name": "y",
                        "type": "uint16"
                    },
                    {
                        "indexed": false,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "char",
                        "type": "bytes4"
                    },
                    {
                        "indexed": false,
                        "name": "colour",
                        "type": "bytes3"
                    },
                    {
                        "indexed": false,
                        "name": "attachment",
                        "type": "string"
                    }
                ],
                "name": "BoxPublished",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "str",
                        "type": "string"
                    }
                ],
                "name": "debug",
                "type": "event"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "x",
                        "type": "uint16"
                    },
                    {
                        "name": "y",
                        "type": "uint16"
                    }
                ],
                "name": "read",
                "outputs": [
                    {
                        "name": "char",
                        "type": "bytes4"
                    },
                    {
                        "name": "attachment",
                        "type": "string"
                    },
                    {
                        "name": "colour",
                        "type": "bytes3"
                    },
                    {
                        "name": "buyer",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "start_x",
                        "type": "uint16"
                    },
                    {
                        "name": "start_y",
                        "type": "uint16"
                    },
                    {
                        "name": "length",
                        "type": "uint16"
                    },
                    {
                        "name": "height",
                        "type": "uint16"
                    }
                ],
                "name": "buy",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "x",
                        "type": "uint16"
                    },
                    {
                        "name": "y",
                        "type": "uint16"
                    },
                    {
                        "name": "char",
                        "type": "bytes4"
                    },
                    {
                        "name": "attachment",
                        "type": "string"
                    },
                    {
                        "name": "colour",
                        "type": "bytes3"
                    }
                ],
                "name": "publish",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "start_x",
                        "type": "uint16"
                    },
                    {
                        "name": "start_y",
                        "type": "uint16"
                    },
                    {
                        "name": "_chars",
                        "type": "string"
                    },
                    {
                        "name": "attachment",
                        "type": "string"
                    },
                    {
                        "name": "colour",
                        "type": "bytes3"
                    }
                ],
                "name": "publishBatch",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "kill",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    },
    ipfs:{
        gateway: 'http://localhost:8081/ipfs/',
        server:{
            host: 'localhost',
            port: 5001,
        }
    }
};