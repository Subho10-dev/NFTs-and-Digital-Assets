// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTMarketplace {
    struct NFT {
        uint256 id;
        address owner;
        string metadata;
        uint256 price;
        bool isForSale;
    }

    struct Auction {
        uint256 nftId;
        address highestBidder;
        uint256 highestBid;
        uint256 auctionEndTime;
        bool isActive;
    }

    uint256 public nftCount;
    uint256 public auctionCount;
    mapping(uint256 => NFT) public nfts;
    mapping(uint256 => Auction) public auctions;

    event NFTMinted(uint256 nftId, address owner, string metadata);
    event NFTListedForSale(uint256 nftId, uint256 price);
    event NFTSold(uint256 nftId, address newOwner, uint256 price);
    event AuctionStarted(uint256 nftId, uint256 auctionEndTime);
    event NewBidPlaced(uint256 nftId, address bidder, uint256 bidAmount);
    event AuctionEnded(uint256 nftId, address winner, uint256 winningBid);

    function mintNFT(string memory _metadata) public {
        nftCount++;
        nfts[nftCount] = NFT(nftCount, msg.sender, _metadata, 0, false);
        emit NFTMinted(nftCount, msg.sender, _metadata);
    }

    function listNFTForSale(uint256 _nftId, uint256 _price) public {
        require(nfts[_nftId].owner == msg.sender, "You are not the owner of this NFT");
        nfts[_nftId].price = _price;
        nfts[_nftId].isForSale = true;
        emit NFTListedForSale(_nftId, _price);
    }

    function buyNFT(uint256 _nftId) public payable {
        require(nfts[_nftId].isForSale, "NFT is not for sale");
        require(msg.value == nfts[_nftId].price, "Incorrect price");

        address seller = nfts[_nftId].owner;
        nfts[_nftId].owner = msg.sender;
        nfts[_nftId].isForSale = false;
        payable(seller).transfer(msg.value);

        emit NFTSold(_nftId, msg.sender, msg.value);
    }

    function startAuction(uint256 _nftId, uint256 _auctionDuration) public {
        require(nfts[_nftId].owner == msg.sender, "You are not the owner of this NFT");
        auctionCount++;
        auctions[auctionCount] = Auction(_nftId, address(0), 0, block.timestamp + _auctionDuration, true);
        emit AuctionStarted(_nftId, block.timestamp + _auctionDuration);
    }

    function placeBid(uint256 _auctionId) public payable {
        Auction storage auction = auctions[_auctionId];
        require(auction.isActive, "Auction is not active");
        require(block.timestamp < auction.auctionEndTime, "Auction has ended");
        require(msg.value > auction.highestBid, "Bid must be higher than current bid");

        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid); // Refund previous highest bidder
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit NewBidPlaced(auction.nftId, msg.sender, msg.value);
    }

    function endAuction(uint256 _auctionId) public {
        Auction storage auction = auctions[_auctionId];
        require(block.timestamp >= auction.auctionEndTime, "Auction is still active");
        require(auction.isActive, "Auction already ended");

        auction.isActive = false;
        if (auction.highestBidder != address(0)) {
            nfts[auction.nftId].owner = auction.highestBidder;
            payable(nfts[auction.nftId].owner).transfer(auction.highestBid);
            emit AuctionEnded(auction.nftId, auction.highestBidder, auction.highestBid);
        }
    }

    function getNFT(uint256 _nftId) public view returns (address owner, string memory metadata, uint256 price, bool isForSale) {
        NFT memory nft = nfts[_nftId];
        return (nft.owner, nft.metadata, nft.price, nft.isForSale);
    }
}
