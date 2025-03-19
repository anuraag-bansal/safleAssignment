require("dotenv").config({path: "./.env"});
const web3Lib = require("./lib/web3.lib");
const {ethers} = require("ethers");
const validatorUtil = require("./utils/validator.util");
const globalLib = require("./lib/global.lib");

// Example Usage
;(async () => {
    try {

        // if (validatorUtil.isEmpty(process.env.INFURA_URL) || validatorUtil.isEmpty(process.env.PRIVATE_KEY)) {
        //     throw new Error("Provider URL or Private Key is empty.Check env file or create one");
        // }

        // globalLib.getOrSetGlobalKey("provider", new ethers.JsonRpcProvider(process.env.INFURA_URL));
        // globalLib.getOrSetGlobalKey("wallet", new ethers.Wallet(process.env.PRIVATE_KEY, globalLib.getGlobalKey("provider")));

        // const recipients = ["0x88bD0CBFA93a5c34A3Ac23F005C269935Cfdd904", "0x88bD0CBFA93a5c34A3Ac23F005C269935Cfdd904"];
        // const amounts = [ethers.parseEther("0.05"), ethers.parseEther("0.05")];
        //
        // await web3Lib.batchTransferETH(recipients, amounts, {
        //     gasLimit: 200000,
        //     maxFeePerGas: ethers.parseUnits("100", "gwei"),
        //     maxPriorityFeePerGas: ethers.parseUnits("1", "gwei")
        // });

        // Example: Token Batch Transfer
        // const tokens = ["0x1c7d4b196cb0c7b01d743fbc6116a902379c7238", "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"];
        // const tokenRecipients = ["0x88bD0CBFA93a5c34A3Ac23F005C269935Cfdd904", "0x88bD0CBFA93a5c34A3Ac23F005C269935Cfdd904"];
        // const tokenAmounts = [5, 5];
        // await web3Lib.batchTransferTokens(tokens, tokenRecipients, tokenAmounts, {
        //     gasLimit: 200000,
        //     maxFeePerGas: ethers.parseUnits("100", "gwei"),
        //     maxPriorityFeePerGas: ethers.parseUnits("1", "gwei")
        // });
        // console.log("Token batch transfer completed");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
