# Dither Indexer (beta)

> This is milestone #2 of the [Dither Roadmap](./roadmap.md).

The Dither Indexer is a relayer that listens to `newBlock` events coming from a Cosmos Hub full node and parses the transactions in each block, checking for valid Dither transactions. If there are valid Dither transactions, they are added to a centralized database.

## Requirements

- **Feature parity with the Dither Protocol** - The Dither Indexer must support the vast majority of the transaction types proposed in the [Dither Protocol Specification](./roadmap-01-spec). This includes identity, social, messsages, message interactions, tokens, and offchain transactions.
- **Database selection** - We need to research and select a suitable database to store messages indexed by the Dither Indexer. This database needs to performant and work well with multiplatform clients.
- **Reliability** - The indexer must stay online as much as possible and correctly catch every valid Dither transaction that goes through the Cosmos Hub. If at any point the indexer goes offline, there should be catchup mechanisms to allow the indexer to rapidly collect all missed messages and add them to the database.
- **Security considerations** - As an uncensorable and agnostic messaging protocol, there will be times when malicious actors will spam the Cosmos Hub with valid transactions that are harmful to the Dither community. We need to find out a way to handle and aleviate these sorts of issues through the Dither Indexer.
