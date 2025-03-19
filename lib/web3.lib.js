require("dotenv").config({path: "../.env"});
const {ethers} = require("ethers");
const config = require("../configs/config.json");

const globalLib = require("../lib/global.lib");
const web3Util = require("../utils/web3.util");
const validatorUtil = require("../utils/validator.util");

const ERC20_ABI = require("../abis/erc.20.abi.json");
const BATCH_CONTRACT_ABI = require("../abis/batch.contract.abi.json");

async function batchTransferETH(recipients, amounts, gasOptions) {
    try {
        if (validatorUtil.isEmpty(recipients) || validatorUtil.isEmpty(amounts)) {
            throw new Error("Recipients or amounts is empty")
        }
        recipients.forEach((recipient) => {
            if (!web3Util.checkValidAddress(recipient)) {
                throw new Error("Invalid recipient address");
            }
        })
        if (recipients.length !== amounts.length) {
            throw new Error("Recipients and amounts should be of same length");
        }

        const provider = globalLib.getOrSetGlobalKey("provider", new ethers.JsonRpcProvider(process.env.INFURA_URL));
        const wallet = globalLib.getOrSetGlobalKey("wallet", new ethers.Wallet(process.env.PRIVATE_KEY, globalLib.getGlobalKey("provider")));

        const contract = new ethers.Contract(config.contract_address, BATCH_CONTRACT_ABI, wallet);
        const totalAmount = amounts.reduce((sum, amount) => sum + BigInt(amount), BigInt(0));

        const txUnitsConsumed = await web3Util.estimateGas(contract, "batchTransferETH", [recipients, amounts, {value: totalAmount}]);
        const currentGasPrice = await web3Util.getCurrentGasPrice(provider);
        console.log(`Current gas price: ${currentGasPrice.toString()}`);
        console.log(`Estimated gas for batchTransferETH: ${txUnitsConsumed.toString()}`);
        console.log("Total Gas Fee: ", ethers.formatEther(txUnitsConsumed * currentGasPrice), "ETH");

        let params = {};
        if (validatorUtil.isNil(gasOptions)) {
            params = {value: totalAmount};
        } else {
            params = {
                value: totalAmount,
                gasLimit: gasOptions.gasLimit,
                maxFeePerGas: gasOptions.maxFeePerGas,
                maxPriorityFeePerGas: gasOptions.maxPriorityFeePerGas
            }
        }

        const tx = await contract.batchTransferETH(recipients, amounts, params);
        await tx.wait();
        console.log("ETH batch transfer completed", tx.hash);
        return tx;
    } catch (error) {
        throw error;
    }
}

async function approveTokens(tokenAddress, spender, amount) {
    try {
        if (!web3Util.checkValidAddress(tokenAddress) || !web3Util.checkValidAddress(spender)) {
            throw new Error("Invalid token address or spender address");
        }
        if (validatorUtil.isNil(amount) || amount <= 0) {
            throw new Error("Invalid amount must be greater than 0");
        }

        const provider = globalLib.getOrSetGlobalKey("provider", new ethers.JsonRpcProvider(process.env.INFURA_URL));
        const wallet = globalLib.getOrSetGlobalKey("wallet", new ethers.Wallet(process.env.PRIVATE_KEY, globalLib.getGlobalKey("provider")));
        const decimals = await web3Util.getTokenDecimals(provider, tokenAddress);
        const parsedAmount = ethers.parseUnits(amount.toString(), decimals);
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
        const tx = await tokenContract.approve(spender, parsedAmount);
        await tx.wait();
        return tx;
    } catch (error) {
        throw error;
    }
}

async function batchTransferTokens(tokens, recipients, amounts, gasOptions) {
    try {
        if (tokens.length !== recipients.length || tokens.length !== amounts.length) {
            throw new Error("Tokens, recipients and amounts should be of same length");
        }

        tokens.forEach((token) => {
            if (!web3Util.checkValidAddress(token)) {
                throw new Error("Invalid token address");
            }
        })

        recipients.forEach((recipient) => {
            if (!web3Util.checkValidAddress(recipient)) {
                throw new Error("Invalid recipient address");
            }
        })

        const provider = globalLib.getOrSetGlobalKey("provider", new ethers.JsonRpcProvider(process.env.INFURA_URL));
        const wallet = globalLib.getOrSetGlobalKey("wallet", new ethers.Wallet(process.env.PRIVATE_KEY, globalLib.getGlobalKey("provider")));
        const contract = new ethers.Contract(config.contract_address, BATCH_CONTRACT_ABI, wallet);

        //after all check we need to approve the tokens
        let totalTxUnitsConsumed = BigInt(0);
        for (let i = 0; i < tokens.length; i++) {
            await approveTokens(tokens[i], config.contract_address, amounts[i]);
            const txConsumedForEachTokenForApproval = await web3Util.estimateGas(new ethers.Contract(tokens[i], ERC20_ABI, wallet), "approve", [config.contract_address, amounts[i]]);
            totalTxUnitsConsumed += txConsumedForEachTokenForApproval;
        }

        const parsedAmounts = await Promise.all(tokens.map(async (token, index) => {
            const decimals = await web3Util.getTokenDecimals(provider, token);
            return ethers.parseUnits(amounts[index].toString(), decimals);
        }));

        const txUnitsConsumed = await web3Util.estimateGas(contract, "batchTransferTokens", [tokens, recipients, parsedAmounts]);
        const currentGasPrice = await web3Util.getCurrentGasPrice(provider);
        console.log(`Estimated gas for batchTransferTokens: ${txUnitsConsumed.toString()}`);
        console.log(`Estimated gas for token approvals: ${totalTxUnitsConsumed.toString()}`);
        console.log(`Current gas price: ${currentGasPrice.toString()}`);
        console.log("Total Gas Fee: ", ethers.formatEther((txUnitsConsumed + totalTxUnitsConsumed) * currentGasPrice), "ETH");

        let params = {};
        if (validatorUtil.isNil(gasOptions)) {
            params = {};
        } else {
            params = {
                gasLimit: gasOptions.gasLimit,
                maxFeePerGas: gasOptions.maxFeePerGas,
                maxPriorityFeePerGas: gasOptions.maxPriorityFeePerGas
            }
        }
        const tx = await contract.batchTransferTokens(tokens, recipients, parsedAmounts, params);
        await tx.wait();
        console.log("Token batch transfer completed", tx.hash);
        return tx;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    batchTransferETH: batchTransferETH, approveTokens: approveTokens, batchTransferTokens: batchTransferTokens
};
