require("dotenv").config({path: "../.env"});
const {Web3} = require("web3")
const {ethers} = require("ethers");
const ERC_20_ABI = require("../abis/erc.20.abi.json");
const validatorUtil = require("../utils/validator.util")

function checkValidAddress(address) {
    try {
        if(validatorUtil.isEmpty(address)) {
            throw new Error("Address is empty")
        }
        const web3 = new Web3(
            process.env.ALCHEMY_KEY,
        )
        return web3.utils.isAddress(address)
    } catch (error) {
        throw error
    }
}

async function getTokenDecimals(provider,tokenAddress) {
    try {
        if (validatorUtil.isEmpty(tokenAddress)) {
            throw new Error(`Token address or provider is empty`)
        }
        const tokenContract = new ethers.Contract(tokenAddress, ERC_20_ABI, provider);
        return await tokenContract.decimals();
    } catch (error) {
        throw error
    }
}

async function getCurrentGasPrice(provider) {
    try {
        return (await provider.getFeeData()).gasPrice
    } catch (error) {
        throw error
    }
}

async function estimateGas(contract,method,args) {
    try {
        return await contract[method].estimateGas(...args);
    } catch (error) {
        throw error
    }
}

module.exports = {
    checkValidAddress: checkValidAddress,
    getTokenDecimals: getTokenDecimals,
    getCurrentGasPrice: getCurrentGasPrice,
    estimateGas: estimateGas
}
