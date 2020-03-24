# Dither Web Client (beta)

> This is milestone #3 of the [Dither Roadmap](./roadmap.md).

The Dither Web Client serves as a way for end-users to view messages, post messages, and interact with other users on the Dither social network. We plan on building mobile applications as well, but it makes the most sense to start with a web client.

## Requirements

- **Transaction type parity with Dither Indexer** - The Dither Web Client must support all of the transaction types built in the [Dither Indexer](./roadmap-01-spec). This includes support for identity, social, messsages, message interactions, tokens, and offchain transactions. The client also need to support viewing these transactions in table and list based views.
- **User Settings Page** - Dither users need to be able to set display names, avatars, and be able to purchase usernames.
- **Home Page** - Dither users need to be able to view messages of users that they are following.
- **Search Page** - Dither users need to be able to search through the history of all memos.
- **Notifications Page** - Dither users need to be able to receive notifications if another user comments, likes, or reposts their content. Likewise if another user follows them.
- **Wallet Page** - Dither users need to be able to send and receive ATOM like any other wallet built for the Cosmos Hub.
- **Login/Signup Pages** - Potential users need a way to sign up for the application.
- **Hashtags Support** - We need to support hashtags. Whether if they should be used for a channels like IRC, Slack, Discord or just as hashtags like Facebook, Twitter, etc. is something we have to figure out.
 significant whitespace in messaging
- **Security considerations** - The web client heavily involves the use of Cosmos Hub transactions. We need to research and figure out a solution that allows users to securely store their private key while allowing them to frictionlessly make Cosmos Hub transactions.

## Reach Goals

- **Browser extension-based wallet support** - There are upcoming browser extensions for Cosmos blockchains that function similarily to MetaMask for Ethereum-based blockchains. These are known as Lunie and Keplr. We should look into how difficult it would be to support these browser-based wallets.
- **File uploads** - 
