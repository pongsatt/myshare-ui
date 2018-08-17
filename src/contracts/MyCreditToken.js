export default [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "shareAddr",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "participant",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "isChaired",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "ShareParticipated",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_targetETH",
				"type": "uint256"
			},
			{
				"name": "_shareNum",
				"type": "uint8"
			},
			{
				"name": "_startInMins",
				"type": "uint256"
			},
			{
				"name": "_minimumInterestETH",
				"type": "uint256"
			}
		],
		"name": "createShare",
		"outputs": [
			{
				"name": "share",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "shareAddr",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "chairman",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "targetETH",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "shareNum",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "startInMins",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "minimumInterestETH",
				"type": "uint256"
			}
		],
		"name": "ShareCreated",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_target",
				"type": "address"
			},
			{
				"name": "_tokens",
				"type": "uint256"
			}
		],
		"name": "lockTokens",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "shareAddr",
				"type": "address"
			},
			{
				"name": "participant",
				"type": "address"
			},
			{
				"name": "isChaired",
				"type": "bool"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "participateShare",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "initialSupply",
				"type": "uint256"
			},
			{
				"name": "recipients",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_target",
				"type": "address"
			},
			{
				"name": "_tokens",
				"type": "uint256"
			}
		],
		"name": "unlockTokens",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
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
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "lockedTokens",
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
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "shareAddresses",
		"outputs": [
			{
				"name": "",
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
		"name": "shareCount",
		"outputs": [
			{
				"name": "count",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "shares",
		"outputs": [
			{
				"name": "",
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
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]