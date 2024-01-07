// helper/utils.ts

/*
 * LIST OF NFT CONTRACT METHODS
 * _)___________________________
balanceOf(address owner)
baseExtension()
cost()
getBaseURI()
getNotRevealedUri()
getTokenURI(uint256 tokenId)
getTokenURIs(uint256[] tokenIds)
name()
symbol()
totalSupply()
*/



import { ethers } from "ethers"; // npm install ethers

import ERC721Json from "../config/contracts/MyERC721MintableByAnyone.json";
import * as config from "../config/config";
import * as ERC20Json from "../config/contracts/MyERC20MintableByAnyone.json";

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const hexToInt = (s: string) => {
  const bn = ethers.BigNumber.from(s);
  return parseInt(bn.toString());
};

export const reloadApp = () => {
  window.location.reload();
};

// Get the last block number
export const getLastBlockNumber = async (ethersProvider: any): Promise<any> => {
  return ethersProvider.getBlockNumber();
};

// Get the CRO balance of address
export const getCroBalance = async (
  serverWeb3Provider: ethers.providers.JsonRpcProvider,
  address: string
): Promise<number> => {
  const balance = await serverWeb3Provider.getBalance(address);
  // Balance is rounded at 2 decimals instead of 18, to simplify the UI
  return (
    ethers.BigNumber.from(balance)
      .div(ethers.BigNumber.from("10000000000000000"))
      .toNumber() / 100
  );
};

// Get the CTOK token balance of address
// The CTOK is a ERC20 smart contract, its address is retrieved from
// the config/config.ts file
// and the ABI from config/contracts/MyERC20MintableByAnyone.json
export const getBalance = async (
  serverWeb3Provider: ethers.providers.JsonRpcProvider,
  address: string
): Promise<number> => {
  // Create ethers.Contract object using the smart contract's ABI
  const contractAbi = ERC20Json.abi;
  const readContractInstance = new ethers.Contract(
    config.configVars.erc20.address,
    contractAbi,
    serverWeb3Provider
  );
  const contractResponse = await readContractInstance["balanceOf"](address);
  // Balance is rounded at 2 decimals instead of 18, to simplify UI
  return (
    ethers.BigNumber.from(contractResponse)
      .div(ethers.BigNumber.from("10000000000000000"))
      .toNumber() / 100
  );
};

// Generate a ethers.Contract instance of the contract object
// together with a signer that will trigger a transaction
// approval in the wallet whenever it is called by the Dapp
export const getWriteContractInstance = async (
  browserWeb3Provider: any
): Promise<ethers.Contract> => {
  const ethersProvider = browserWeb3Provider;
  const contractAbi = ERC20Json.abi;
  // Create ethers.Contract object using the smart contract's ABI
  const readContractInstance = new ethers.Contract(
    config.configVars.erc20.address,
    contractAbi,
    ethersProvider
  );
  // Add a signer to make the ethers.Contract object able
  // to craft transactions
  const fromSigner = ethersProvider.getSigner();
  return readContractInstance.connect(fromSigner);
};





// Get the NFT data of address
// The NFT is a ERC721 smart contract, its address is retrieved from
// the config/config.ts file
// and the ABI from config/contracts/MyERC721MintableByAnyone.json


/*export const getNFTData = async (
    serverWeb3Provider: ethers.providers.JsonRpcProvider,
    address: string
): Promise<any> => {
    // Create ethers.Contract object using the smart contract's ABI
    const contractAbi = ERC721Json;
    const readContractInstance = new ethers.Contract(
        "0x230Bb7ce185CD0042973202f5F38B7072440e2C9",
        contractAbi,
        serverWeb3Provider
    );
    return
    
}
*/


export const getNFTData = async (
    serverWeb3Provider: ethers.providers.JsonRpcProvider,
    address: string
): Promise<any> => {
    // Create ethers.Contract object using the smart contract's ABI
    const contractAbi = ERC721Json;
    
    const readContractInstance = new ethers.Contract(
        "0x230Bb7ce185CD0042973202f5F38B7072440e2C9",
        contractAbi,
        serverWeb3Provider
    );

    // Call the function that returns the NFTs owned by the user
    const nftIds = await readContractInstance["balanceOf"](address);

    // Map over the NFT IDs and retrieve the metadata for each NFT
    const nfts = await Promise.all(
        nftIds.map(async (nftId: number) => {
            const nft = await readContractInstance.functions.getTokenURI(nftId);
            return nft;
        })
    );

    return nfts;
};






