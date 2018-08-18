const fs = require('fs');
const utils = require('./smartcontract-utils');

const contractInterface = utils.getContractInterface('smartcontracts', 'MyCreditToken.sol', 'MyCreditToken');
const {output} = contractInterface;

async function main() {
    updateContract('MyCreditToken');
    updateContract('MyShare');
}

function updateContract(name) {
    console.log('updating interface: ', name);
    const inf = output.contracts[`${name}.sol:${name}`].interface;
    writeFile(`src/contracts/${name}.js`, 'export default ' + inf);
    console.log('updating interface: ', name, ' done.');
}

function writeFile(path, content) {
    console.log(`Write file path ${path} with content length: ${content.length}`);
    fs.writeFileSync(path, content);
    console.log(`Write file path ${path}. done.`);
}

if (require.main === module) {
    main();
}

