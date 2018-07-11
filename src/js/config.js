module.exports = {
    network: 'private',
    MFC:{
        address: {
            private: '0xf7159e33d8425057238675946d406e7acdfba096',
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
                "constant": true,
                "inputs": [],
                "name": "boardBuyers",
                "outputs": [
                    {
                        "name": "",
                        "type": "address[10000]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "boardChars",
                "outputs": [
                    {
                        "name": "",
                        "type": "bytes4[10000]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "boardAttachments",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool[10000]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "boardColours",
                "outputs": [
                    {
                        "name": "",
                        "type": "bytes3[10000]"
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
                "name": "publishBlock",
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
    }
}