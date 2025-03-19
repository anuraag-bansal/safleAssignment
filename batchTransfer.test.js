const { expect } = require("chai");
const sinon = require("sinon");
const { ethers } = require("ethers");
const batchTransfer = require("./lib/web3.lib"); // Update this path
const web3Util = require("./utils/web3.util");
const globalLib = require("./lib/global.lib");

describe("Batch Transfer Functions", function () {
    let providerMock, walletMock, contractMock;

    beforeEach(() => {
        // Mock provider & wallet
        providerMock = sinon.createStubInstance(ethers.JsonRpcProvider);
        walletMock = sinon.createStubInstance(ethers.Wallet);

        // Mock contract & methods
        contractMock = {
            batchTransferETH: sinon.stub(),
            batchTransferTokens: sinon.stub(),
            approve: sinon.stub()
        };

        // Stubbing globalLib to return mock provider & wallet
        sinon.stub(globalLib, "getGlobalKey").callsFake((key) => {
            if (key === "provider") return providerMock;
            if (key === "wallet") return walletMock;
        });

        // Mock ethers.Contract to return contractMock
        sinon.stub(ethers, "Contract").returns(contractMock);
    });

    afterEach(() => {
        sinon.restore(); // Reset all stubs after each test
    });

    it("should throw error if recipients or amounts are empty in batchTransferETH", async () => {
        try {
            await batchTransfer.batchTransferETH([], [], {});
        } catch (error) {
            expect(error.message).to.equal("Recipients or amounts is empty");
        }
    });

    it("should throw error for invalid recipient address in batchTransferETH", async () => {
        sinon.stub(web3Util, "checkValidAddress").returns(false);
        try {
            await batchTransfer.batchTransferETH(["invalidAddress"], ["1000000000000000000"], {});
        } catch (error) {
            expect(error.message).to.equal("Invalid recipient address");
        }
    });




    it("should throw error for invalid token address in batchTransferTokens", async () => {
        sinon.stub(web3Util, "checkValidAddress").returns(false);
        try {
            await batchTransfer.batchTransferTokens(["invalidToken"], ["0xRecipient"], [100], {});
        } catch (error) {
            expect(error.message).to.equal("Invalid token address");
        }
    });


});
