// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

/// @param holographFeeManager Holograph Fee Manager
/// @param holographERC721TransferHelper Transfer helper
/// @param marketFilterAddress Market filter address - Manage subscription to the for marketplace filtering based off royalty payouts.
/// @param contractName Contract name
/// @param contractSymbol Contract symbol
/// @param initialOwner User that owns and can mint the edition, gets royalty and sales payouts and can update the base url if needed.
/// @param fundsRecipient Wallet/user that receives funds from sale
/// @param editionSize Number of editions that can be minted in total. If type(uint64).max, unlimited editions can be minted as an open edition.
/// @param royaltyBPS BPS of the royalty set on the contract. Can be 0 for no royalty.
/// @param setupCalls Bytes-encoded list of setup multicalls
/// @param metadataRenderer Renderer contract to use
/// @param metadataRendererInit Renderer data initial contract
struct DropInitializer {
  address holographFeeManager;
  address holographERC721TransferHelper;
  address marketFilterAddress;
  string contractName;
  string contractSymbol;
  address initialOwner;
  address payable fundsRecipient;
  uint64 editionSize;
  uint16 royaltyBPS;
  bytes[] setupCalls;
  address metadataRenderer;
  bytes metadataRendererInit;
}
