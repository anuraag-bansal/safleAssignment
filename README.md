# Batch Transfer SDK for Ethereum

## Overview

This SDK provides functionalities to batch transfer ETH and ERC-20 tokens efficiently on the Ethereum blockchain. 
It helps streamline multi-recipient payments, making transactions faster and more cost-effective.
This contract that is used is deployed on the Sepolia testnet and the contract address is 0xa3522023b2ce50edec77dfb73cca2c281f97e387.

## Features

1. Batch ETH Transfers: Send ETH to multiple addresses in a single transaction.

2. Batch ERC-20 Token Transfers: Transfer tokens to multiple recipients efficiently.

3. Gas Estimation: Estimates gas fees for batch transactions to optimize costs.

4. Custom Gas Options: Set custom gas price and limit for transactions.

5. Token Approval: Approves token transfers before executing the batch transfer.

6. Modular & Extensible: Structured for easy integration into existing Ethereum applications.

## Prerequisites

1. Node.js (>= v16.0)

2. Infura account for Ethereum RPC provider

3. Alchemy account for checking valid addresses

4. Ethereum Wallet Private Key (Do NOT expose your private key in production!)


## Installation

Install the necessary dependencies using npm:

```bash

npm install 

```

## Configuration

Create a .env file and set your private key and provider URL:

``````
PRIVATE_KEY=your_private_key (Will be a 64 character hex string)
INFURA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
ALCHEMY_KEY=YOUR_ALCHEMY_PROJECT_ID
``````

## Usage

There is a sample script called index.js that demonstrates how to use the functions.
In the script a new instance of provider and wallet is created for using the functions.
We have also created the instance in the function itself so that you can directly use the functions in your code.

1. If you want to transfer ETH, call the `batchTransferETH` function with an array of recipient addresses and amounts.
2. If you want to transfer ERC-20 tokens, call the `batchTransferTokens` function with the token contract address, recipient addresses, and amounts.
3. Write the token amounts in normal units (not in wei).

## Function Signatures

1. `batchTransferETH(recipients, amounts, gasOptions)`

where recipients is an array of recipient addresses, amounts is an array of amounts to send, and gasOptions is an optional object with custom gas options.

2. `batchTransferTokens(tokenAddress, recipients, amounts, gasOptions)`

where tokenAddress is the ERC-20 token contract address, recipients is an array of recipient addresses, amounts is an array of amounts to send, and gasOptions is an optional object with custom gas options.

For eg: if u want to send 0.1 ETH to two addresses simple write batchTransferETH(["0xAddress1","0xAddress2"],[0.1,0.1]) in the function.

Similarly for ERC-20 tokens, if you want to send 100 usdc to two addresses, write batchTransferTokens(["0xAddressOfToken1","0xAddressOfToken2"],["0xAddress1","0xAddress2"],[100,100]) in the function.
In batch transfer tokens we have to separately approve the token transfer before executing the batch transfer.
the reason is that the approve function takes the msg.sender as the address from which the tokens are approved.

## Gas Options

You can set custom gas options for batch transactions. 
FOr eg : you can pass
``````
{
gasLimit: 200000,
maxFeePerGas: ethers.parseUnits("100", "gwei"),
maxPriorityFeePerGas: ethers.parseUnits("1", "gwei")
}
``````
in the gasOptions field of the function.


## Security Considerations

DO NOT expose your private key when using this SDK.

Gas costs: Batch transactions consume more gas, so estimate costs before execution.

Error Handling: Implement robust error handling to prevent transaction failures.

## License

This SDK is open-source and free to use.
