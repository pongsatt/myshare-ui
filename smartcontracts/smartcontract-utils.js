const fs = require('fs');
const solc = require('solc');

function compile(rootPath, contractFile) {
    const contractPath = `${rootPath}/${contractFile}`;
    console.log(`Compiling contract file ${contractPath}`);

    const findImports = (path) => {
        const contents = fs.readFileSync(`${rootPath}/${path}`).toString();
        return {contents};
    }

    const contractContent = fs.readFileSync(contractPath);
    const input = {[contractFile]: contractContent.toString()};
    const output = solc.compile({sources: input}, 1, findImports);

    if (output.errors) {
        throw output.errors;
    }

    console.log('compiled');
    return output;
}

function getContractInterface(rootPath, contractFile, contractClass) {
    const output = compile(rootPath, contractFile);

    const contractKey = `${contractFile}:${contractClass}`;

    const bytecode = output.contracts[contractKey].bytecode;
    const data = '0x' + bytecode;
    const abi = JSON.parse(output.contracts[contractKey].interface);

    return {
        data,
        abi,
        output
    }
}

module.exports = {
    compile,
    getContractInterface
}