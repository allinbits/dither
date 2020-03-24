# Dither Web Client (beta)

> This is milestone #3 of the [Dither Roadmap](./roadmap.md).

The Dither Web Client serves as a way for end-users to view messages, post messages, and interact with other users on the Dither social network. We plan on building mobile applications as well, but it makes the most sense to start with a web client.

## Requirements

- **Transaction type parity with Dither Indexer** - The Dither Web Client must support all of the transaction types built in the [Dither Indexer](./roadmap-01-spec). This includes support for identity, social, messsages, message interactions, tokens, and offchain transactions. The client also need to support viewing these transactions in table and list based views.
- **Username** - Dither users need to be able to purchase usernames
- **Hashtags** - We need to figure out whether hashtags should be used for channels or just for hashtags.
- **Search** - Dither users need to be able to search through the history of all memos.
- **Notifications** - Dither users need to be able to receive notifications if another user comments, likes, or reposts their content. Likewise if another user follows them.
- **Wallet** - Dither users need to be able to send and receive ATOM like any other wallet built for the Cosmos Hub.
 significant whitespace in messaging
- **Security considerations** - The web client heavily involves the use of Cosmos Hub wallets. We need to research and figure out a solution that allows users to securely store their tokens while allowing frictionless Cosmos Hub transactions.

## Reach Goals

- **Browser extension-based wallet support** - There are upcoming browser extensions for Cosmos blockchains that function similarily to MetaMask for Ethereum-based blockchains. These are known as Lunie and Keplr. We should look into how difficult it would be to support these browser-based wallets.
- **File uploads** - 
