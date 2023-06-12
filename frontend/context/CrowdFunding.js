import React, {useState, useEffect} from "react";
import web3modal from "web3modal";
import { ethers } from "ethers";

//Internal imports

import { CrowdFundingAddress, CrowdFundingABI } from "./constants";


//1. Fetching the smart contract

const fetchContract = (signerOrProvider) => (
    new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider)

);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
    const titleData = "Crowd Funding smartcontract";
    const [currentAccount, setCurrentAccount] = useState("");

    const createCampaign = async (campaign) => {
        const {title, description, amountCollected, deadline} = campaign;

        const web3modal = new web3modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        console.log(currentAccount);

        try {
            const transaction = await contract.createCampaign(
                currentAccount,  //owner
                title,  //campaign title
                description,  //campaign description
                ethers.utils.parseUnits(amountCollected, 18),  //amount collected
                new Date(deadline).getTime()  //campaign deadline
            );

            await transaction.wait();

            console.log("Contract call success", transaction);

        } catch (error) {
            console.log("Contract call fail", error);
        }
    };

    const getCampaigns = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);
        const campaigns = await contract.getCampaigns();

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            pId: i,

        }));

        return parsedCampaigns;

    };

};


//to get info on all campaigns a user has created

const getUserCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const allCampaigns = await contract.getCampaigns();

    //get account of particular user
    const accounts = await window.ethereum.request({
        method: "eth_accounts",
    });

    const currentUser = accounts[0];

    const filterCampaigns = allCampaigns.filter(
        (campaign) => (
            campaign.owner === '0x8660147C637967BaA8909e87F14A87E376b6816A'
        )
    );

    const userData = filterCampaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        pId: i
    }));

    return userData;
    
};

// allow users to donate to campaigns

const donateToCampaign = async (pId, amount) => {
    const web3modal = new web3modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.JsonRpcProvider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const campaignData = await contract.donateToCampaign(pId, {
        value: ethers.utils.parseEther(amount),
    });

    await campaignData.wait();
    location.reload();   //reload the browser

    return campaignData;
};


// get all donations to a particular campaign

const getDonations = async (pId) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const donations = await contract.getDonators(pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i ++) {
        parsedDonations.push({
            donator: donations[0][i],
            amount: ethers.utils.formatEther(donations[1][i].toString()),
        });
    };

    return parsedDonations;
};


// check if user's wallet is connected

const checkIfWalletIsConnected = async () => {
    try {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length!== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found");
        }
    } catch (error) {
        console.log("Error while connecting to wallet ", error);
    };

};

useEffect(() => {
    checkIfWalletIsConnected();
}, []);

// on click event to connect to metamask when button's clicked

const connectWallet = async () => {
    try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Get MetaMask!");
            return;
        }

        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });

        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
    } catch (error) {
        console.log("Error while connecting to wallet ", error);
    };
};


return(
    <CrowdFundingContext.Provider 
        value={{
            titleData,
            currentAccount,
            createCampaign,
            getCampaigns,
            getUserCampaigns,
            donateToCampaign,
            getDonations,
            connectWallet,
        }}
    > 
    {children}    
    </CrowdFundingContext.Provider>
);



