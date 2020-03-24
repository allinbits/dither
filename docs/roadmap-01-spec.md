# Dither Protocol Specification (beta)

> This is milestone #1 of the [Dither Roadmap](./roadmap.md).

We need to research, design, and publish a messaging protocol for Dither, built on top of the Cosmos Hub memo field. Once IBC is launched, we should try and update the protocol to support cross-chain communications.

## Requirements

- **Identity transactions** - We have to provide a way for users to specify and customize their identity. This would include the minimum email address, username, display name, avatar. There may be a way to collaborate with starname in implementing identity.
- **Social transactions** - We need to include a way for users to follow, unfollow, and block other users. Without these features, it's difficult for users to be engaged.
- **Message transactions** - The protocol needs to support broadcast-type transactions at a minimum, where one user can broadcast a message to many others. Direct user to user message transactions is also useful, but may be a reach goal.
- **Message interaction transactions** - The protocol needs to support user interactions with messages. This includes things like commenting, liking, and reposting a parent message.
- **Token transactions** - Sending tokens is a primary feature of the Cosmos Hub. We need to make sure to maintain support for this.
- **Offchain transactions** - Not all of the features need to be communicated to the Cosmos Hub. One example are user notifications - I don't think it makes sense to check "read" on a notification and make that transaction on the Hub. There are probably others.
- **Security considerations** - As an uncensorable messaging protocol, there will be times when messages are unwanted by the general community. We need to make sure this protocol has defenses against spammers and malicious attackers.

## Reach Goals

- **IBC support** - We need to understand the IBC spec and figure out if it's possible, and how, to conduct interblockchain messaging with Dither.
- **More messaging transactions** - More types of message transactions, like polls, could be added.
