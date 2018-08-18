const fs = require('fs');
const Web3 = require('Web3');
const utils = require('./smartcontract-utils');

const contractInterface = utils.getContractInterface('smartcontracts', 'MyCreditToken.sol', 'MyCreditToken');
const {data, abi} = contractInterface;

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

async function main() {
    await createTokenContract();
}

async function createTokenContract() {
    const initialSupply = 300;
    const recipients = ['0x954c8e10ed7eab4e467085f876b9d4534a488737', '0x72b726a2052eef85561423ef5bcdc2e9eff9daf6', '0x9233a42215dce935e7d34108c0d420276468b82d'];

    var mycredittokenContract = new web3.eth.Contract(abi);
    mycredittokenContract.deploy({
        data, arguments: [initialSupply, recipients]
    })
        .send({
            from: '0x954c8e10ed7eab4e467085f876b9d4534a488737',
            gas: 4700000,
        })
        .on('error', function (error) { console.log('error: ', error) })
        // .on('transactionHash', function (transactionHash) { console.log('transactionHash: ', transactionHash) })
        // .on('receipt', function (receipt) {
        //     console.log(receipt.contractAddress)
        // })
        // .on('confirmation', function (confirmationNumber, receipt) { console.log('confirmation:', confirmationNumber, receipt) })
        .then(function (newContractInstance) {
            console.log('newContractInstance:',newContractInstance.options.address) // instance with the new contract address
            writeContractAddress(newContractInstance.options.address);
        });
}

function writeContractAddress(address) {
    const srcPath = 'src/web3/tokenContractAddress.ts';
    fs.writeFileSync(srcPath, `export default '${address}';`);
    console.log(`writeContractAddress to ${srcPath} done.`);
}

if (require.main === module) {
    main();
}

