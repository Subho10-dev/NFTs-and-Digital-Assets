let web3;
let contract;
let userAccount;
const contractAddress = '0x2AF4D2CE67b3f1de65A5D4cec941186dcEd9b75F'; // 
const contractABI = [[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "winningBid",
				"type": "uint256"
			}
		],
		"name": "AuctionEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "auctionEndTime",
				"type": "uint256"
			}
		],
		"name": "AuctionStarted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "NFTListedForSale",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "metadata",
				"type": "string"
			}
		],
		"name": "NFTMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "NFTSold",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bidAmount",
				"type": "uint256"
			}
		],
		"name": "NewBidPlaced",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "auctionCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "auctions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "highestBidder",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "highestBid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "auctionEndTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_nftId",
				"type": "uint256"
			}
		],
		"name": "buyNFT",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_auctionId",
				"type": "uint256"
			}
		],
		"name": "endAuction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_nftId",
				"type": "uint256"
			}
		],
		"name": "getNFT",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "metadata",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isForSale",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_nftId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "listNFTForSale",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_metadata",
				"type": "string"
			}
		],
		"name": "mintNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nftCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "nfts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "metadata",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isForSale",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_auctionId",
				"type": "uint256"
			}
		],
		"name": "placeBid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_nftId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_auctionDuration",
				"type": "uint256"
			}
		],
		"name": "startAuction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
];

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = (await web3.eth.getAccounts())[0];
        document.getElementById('account').textContent = `Connected: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert('Please install MetaMask or a compatible wallet extension.');
    }
};

// Mint NFT
document.getElementById('mintBtn').onclick = async () => {
    const metadata = document.getElementById('metadata').value;
    if (!metadata) {
        alert('Please provide metadata!');
        return;
    }

    try {
        await contract.methods.mintNFT(metadata).send({ from: userAccount });
        alert('NFT Minted!');
    } catch (error) {
        console.error(error);
        alert('Error minting NFT.');
    }
};

// List NFT for Sale
document.getElementById('listForSaleBtn').onclick = async () => {
    const nftId = document.getElementById('nftIdForSale').value;
    const price = document.getElementById('price').value;

    if (!nftId || !price) {
        alert('Please provide valid NFT ID and price.');
        return;
    }

    try {
        await contract.methods.listNFTForSale(nftId, web3.utils.toWei(price, 'ether')).send({ from: userAccount });
        alert('NFT Listed for Sale!');
    } catch (error) {
        console.error(error);
        alert('Error listing NFT.');
    }
};

// Buy NFT
document.getElementById('buyNFTBtn').onclick = async () => {
    const nftId = document.getElementById('nftIdToBuy').value;
    if (!nftId) {
        alert('Please provide NFT ID.');
        return;
    }

    try {
        const nft = await contract.methods.getNFT(nftId).call();
        if (!nft.isForSale) {
            alert('This NFT is not for sale.');
            return;
        }

        await contract.methods.buyNFT(nftId).send({
            from: userAccount,
            value: nft.price
        });
        alert('NFT Bought!');
    } catch (error) {
        console.error(error);
        alert('Error buying NFT.');
    }
};

// Start Auction
document.getElementById('startAuctionBtn').onclick = async () => {
    const nftId = document.getElementById('nftIdForAuction').value;
    const duration = document.getElementById('auctionDuration').value;

    if (!nftId || !duration) {
        alert('Please provide NFT ID and auction duration.');
        return;
    }

    try {
        await contract.methods.startAuction(nftId, duration).send({ from: userAccount });
        alert('Auction Started!');
    } catch (error) {
        console.error(error);
        alert('Error starting auction.');
    }
};

// Place Bid
document.getElementById('placeBidBtn').onclick = async () => {
    const auctionId = document.getElementById('auctionIdToBid').value;
    const bidAmount = document.getElementById('bidAmount').value;

    if (!auctionId || !bidAmount) {
        alert('Please provide auction ID and bid amount.');
        return;
    }

    try {
        await contract.methods.placeBid(auctionId).send({
            from: userAccount,
            value: web3.utils.toWei(bidAmount, 'ether')
        });
        alert('Bid Placed!');
    } catch (error) {
        console.error(error);
        alert('Error placing bid.');
    }
};

// End Auction
document.getElementById('endAuctionBtn').onclick = async () => {
    const auctionId = document.getElementById('auctionIdToEnd').value;
    if (!auctionId) {
        alert('Please provide auction ID.');
        return;
    }

    try {
        await contract.methods.endAuction(auctionId).send({ from: userAccount });
        alert('Auction Ended!');
    } catch (error) {
        console.error(error);
        alert('Error ending auction.');
    }
};
