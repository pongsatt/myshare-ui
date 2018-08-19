This is a demo Distributed Application to create a trusted share between people.

There are 2 smart contract related
* Token Smart Contract - to manage people credit. more token means more reputation.
* Share Smart Contract - to manage individual trusted share

### Demo page
https://pongsatt.github.io/shares

# Start development

## Required software

* NodeJs version 8+

## Clone this project

```
git clone https://github.com/pongsatt/myshare-ui.git

cd myshare-ui

yarn
```

## Start Ethereum blockchain test server [ganache-cli](https://github.com/trufflesuite/ganache-cli)

```
# On project directory
yarn ethserve
```

## Initialize token smart contract

```
yarn gentoken
```

What it does?
* Compile smart contract source code at "smartcontracts/MyCreditToken.sol"
* Deploy this smart contract to ganache server running from previous step
* Update smart contract address at "src/web3/tokenContractAddress.ts"

# Start playing with UI

## Install MetaMask chrome extension (If have not been done)
[MetaMask Chrome Extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en)

## Point MetaMask to local server
* Click MetaMask icon
* select "localhost 8545" network

## Import accounts to MetaMask
* Click MetaMask icon
* Click account icon
* Open file "smartcontracts/testaccounts.txt"
* Import first 3 private keys one by one

** If done correctly, you will see token number > 0

## Start development server

Open cloned directory and run command below.

```
yarn start
```