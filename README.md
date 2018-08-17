This is a demo Distributed Application to create a trusted share between people.

There are 2 smart contract related
* Token Smart Contract - to manage people credit. more token means more reputation.
* Share Smart Contract - to manage individual trusted share

# Start development

## Required software

* NodeJs version 8+

## Clone this project

```
git clone https://github.com/pongsatt/myshare-ui.git
```

## Install and run Ethereum blockchain test server [ganache-cli](https://github.com/trufflesuite/ganache-cli)

```
npm install -g ganache-cli

mkdir ganache-share-db
ganache-cli --db ganache-share-db
```

## Import smart contract to remix ide

* Open remix [here](https://remix.ethereum.org/#optimize=true&version=soljson-v0.4.24+commit.e67f0147.js)
* Select tab "Run" and choose "Environment" to "Web3 Provider" then confirm
* Create new file named "MyCreditToken.sol"
* Copy content from [MyCreditToken.sol](https://raw.githubusercontent.com/pongsatt/myshare-ui/master/smartcontracts/MyCreditToken.sol)
* Create new file named "MyShare.sol"
* Copy content from [MyShare.sol]((https://raw.githubusercontent.com/pongsatt/myshare-ui/master/smartcontracts/MyShare.sol))


## Install MetaMask chrome extension
TBD

## Import accounts to MetaMask
TBD

## Initialize token smart contract
TBD

## Start development server

Open cloned directory and run command below.

```
yarn start
```