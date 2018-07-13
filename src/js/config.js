/**
 *
 * @type {{network: string, MFC: {address: {private: string, ropsten: string}, block: {private: number, ropsten: number}, abi: *[]}, ipfs: {gateway: string, server: {host: string, port: number}}}}
 *
 *
 (0) 0x2dd709650e3463343d0ee76c7bcf8799f499b4dbf226f09824acba601214b93e
 (1) 0x53dec80aab5f385b0832f1d5ec79c9e54ca8a0b446bca71b6b810be5246b8034
 (2) 0xa9d0056ab6709cf4a00a71a88a4fba2f24337bb24ba148d35a843b73108bdb80
 (3) 0x14206a1475c14e21f8b23bd9fbea8d4d87970bf1afe93f4da06e2556526c8779
 (4) 0x7e50623f51a32a31172570ae7ae3981afcf677d88a8f91fca67f548b17fedefd
 (5) 0x4be55d98e42698e308ecdb8db778d66e3f7e13d355f57b848273d7eed2f33fff
 (6) 0x8b672ff07dd0db74eaf616d949cd324190bf9b1e72a1ba1c994301e9c3596622
 (7) 0x106f629d83801d3fd8dfdc420e2d54f7abbaa8ea464c59fb9a0e944c0244024c
 (8) 0xb4f63fe3650b4a6a20a118ea7ee5ba9493ffda9f74e7cfda4d32c641176593e7
 (9) 0xa673541f173c1015b879b65450e9eacf8f8b3113563e4c9cc527842210ebfd4d
 */

module.exports = {
    network: 'private',
    MFC:{
        address: {
            private: '0x20b3b1a385519e28149f2ad1a08bc746e392ce8d',
            ropsten: '0xa10fbb3fbdf0fe9d40cc546d281a40b2679cdbdb',
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
        gateway: 'https://ipfs.io/ipfs/',
        server:{
            host: 'localhost',
            port: 5001,
        }
    }
};