const hre = require("hardhat");

async function main() {
  try {
    // Get the ContractFactory of your SimpleContract
    const SimpleContract = await hre.ethers.getContractFactory("Tournament");

    // Connect to the deployed contract
    const contractAddress = "0x4ac3de93FFAb740d60Ab414C675d8BA9865D4058"; // Replace with your deployed contract address
    const contract = await SimpleContract.attach(contractAddress);

	// await contract.setName("test", "Edgar 2");

	console.log(await contract.getName("test"));

    // Set a new message in the contract
    // const newMessage = "Hello, Hardhat!";
    // await contract.setMessage(newMessage);

    // // Retrieve the updated message
    // const updatedMessage = await contract.getMessage();
    // console.log("Updated Message:", updatedMessage);
  } catch (error) {

	console.log("agfsdgasfgagfadfhaghd");

    console.error(error);
    process.exit(1);
  }
}

main();