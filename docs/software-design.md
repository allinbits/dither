# Dither Software Design Document

## 1. Vision

Today's social networks are means for the majority of humanity to communicate with their local and global communities. But these networks are owned by corporations that serve their shareholders, and not their billions of users. It is the mission of Dither to solve the issue of centralized power and censorship created by current social networks. We hope to offer to users of Dither their own sovereign channel of communication to the world without fearing for censorship or bans.

The long term vision of Dither is a self-sustaining community of engaged users and volunteer developers who together run an uncensorable and decentralized social network.

### 1.1 Business Goals

### 1.2 Business Needs

#### 1.3 Audiences

There will be different types of users who may be interested in using Dither. Here are some of the audience categories.

#### 2.1.1 ATOM Holder

The initial audience that we hope will flock to Dither are ATOM holders. There are disputes around ownership of discussion channels in the Cosmos community. The primary issue is that a decentralized network does not map well to a communication channels with single sources of authority. Whoever owns the communication channel wields too much power in a decentralized network.

Dither hopes to fix that problem. It's built on the Cosmos Hub where admin level permissions don't exist. People are free to communicate on any topic they want without fear of being banned by a moderator, and other people can follow their preferred source of news and block the others.

#### 2.1.2 Dither Developer

An interesting audience segment for Dither is the application developer. Since Dither is an open protocol, it enables third-party Cosmos SDK developers to embed Dither within their own product. The possiblities are endless, but we have to make sure our APIs are well-documented and code is well-structured to allow developers to easily dig in.

We need an incentive structure to enourage developers to upstream their code. One tantalizing option is developing a plugin system that encourages the community to publish their own open-source Dither modules for everyone else.

#### 2.1.3 Blockchain Enthusiast

Similar to ATOM token holders, blockchain enthusiasts understand the resilience of decentralized governance. We're hoping blockchain enthusiasts will come onboard Dither and bring along their own communities.

We can encourage blockchain enthusiasts and investors to join by building and promoting a Dither blockchain with some sort of Dither token.

#### 2.1.4 Mainstream Early Adopter

Over time, assuming we build a great product, the majority of the people using Dither will be mainstream early adopters. It's been clear over the years that social media corporations do not have our best interests at heart. They have a terrifying power to ban anything they disagre with. As is their right as private corporations. But we believe that communication should not be censored -- thus Dither.

We can court the mainstream early adopter by building a strong brand and a very usable product. They should not have to know anything about blockchain or ~7 second transaction times to use Dither.

### 1.4 Defining Success

The first level of success is gauging usage. How many people are using Dither on a day-to-day basis? How much time do they spend using the application? Is the number of users growing over time?

The second level of success is courting developers. If we manage to bring together a healthy ecosystem of developers who use and develop on Dither or on top of Dither, we can say we've succeeded on higher level.

What would make Dither truly successful? We think that Dither will be successful when it becomes self-sustaining. We're hoping for a community of engaged users and volunteer developers to emerge from the initial set of users. We hope will self-govern and organize themselves to continue running Dither into perpetuity.

## 2. System Overview

Dither is a collection of open source components that works together to enable an uncensorable and decentralized social network for web and mobile devices. User interaction on Dither is powered by the Cosmos Hub blockchain. User data is stored in an SQL database that is written to by a transaction indexing tool that we create.

### 2.1 Functionality Requirements

Dither needs to meet a set of functionaity requirements, listed below.

#### 2.1.1 Follow
#### 2.1.2 Post
#### 2.1.3 Search
#### 2.1.4 Notify
#### 2.1.5 Send

### 2.2 System Components

Dither is made up of three core components: (1) the blockchain, (2) the indexer, and (3) the client. This section will detail out these three parts.

#### 2.2.1 Dither Blockchain

Dither is a social network powered by blockchain technology. Currently, this is the Cosmos Hub blockchain. We expect that with future growth, we will strain the limits of the transaction throughput on the Cosmos Hub. Well, either that or the transactions will be too expensive to combat the greater usage. The long-term goal of Dither is to put it onto its own application-specific blockchain.

##### 2.2.1.1 Dither on the Cosmos Hub

For at least first year of development, we expect that we will be piggy-backing off of the Cosmos Hub blockchain.

##### 2.2.1.2 Dither on an application-specific blockchain

Going into the second year, we will have the resources to research, build and launch a custom blockchain for Dither.

#### 2.2.2. Dither Indexer

The Dither Indexer is a database that interacts with a Cosmos Hub full node to query for and store information. It is the primary data store for Dither and is queried by various front-ends to allow users to sign up, login, view, send, and query for messages.

#### 2.2.3 Dither Client

THe Dither client is an interchangeable component of Dither. We plan on building and maintaining three separate clients in order to be as accessible to as large of an audience as possible.

##### 2.2.3.1 Dither Web
The Dither Web Client is a graphical user interface built with modern web technologies. It is the first client that we will build for Dither, and it will serve as the reference implementation for the iOS and Android applications.

#### 2.2.3.2 Dither iOS
The iOS Client is a full-featured Dither application for recent iOS devices.

#### 2.2.3.3 Dither Android
The Android Client is a full-featured Dither application for recent Android devices.

## 3. Dither Client Specification

### 3.1 Application Routes

Note that `(auth)` means that the user needs to be logged in, and that `(no-ui)` means this route doesn't have a page associated with it, and it should redirect the user to another page.

* /explore - The homepage for signed out users. Encourages users to sign up for a new account.
* /welcome - (no-ui) This is the signup flow for new users
  * /welcome/signup - First step of signup, accepts a username and password.
      * Field - Username
      * Field - Password
      * Button - Continue
  * /welcome/wallet - Second step signup that creates a wallet for the user
      * Text - Explanation of what this wallet is for
      * Text - Displays the private key for the user to backup manually
      * Button - I've backed up my mnemonic
  * /welcome/wallet-confirm - Second step signup that creates a wallet for the user
      * Textarea - Requests the user to input part of their private key
      * Text - Displays checkmark if the private key is correct
      * Button - Start over and generate a new wallet
      * Button - Continue
  * /welcome/tokens - Third step signup that somehow gives tokens to the user
      * Button - Get tokens
      * Text - Displays the current user balance
      * Button - I have tokens!
  * /welcome/follow - Fourth step of signup that encourages the user to follow some accounts.
* /login - Displays a form to allow registered users to login.
* /index - (auth) The homepage for signed in users. Displays recent messages posted by signed-in users's following
* /accounts - (no-ui)
  * /accounts/:account - Displays recent messages posted by a specific account.
  * /accounts/:account/messages/:message - Displays a specific message posted by a specific account.
* /notifications - (auth) Displays a list of notifications for the signed-in user.
* /search - (no-ui) supports queries for block height, transaction hash, @username, cosmos address, hashtag, or plaintext.
  * /search/:height - Displays messages posted on a specific block height
  * /search/:hash - Displays a specific message with this transaction hash
  * /search/:username - Displays users that have a similar username to the query
  * /search/:address - Displays recent messages posted by a specific address
  * /search/:hashtag - Displays recent messages with a specific hashtag
* /account - (no-ui) These pages apply to a specific user.
  * /account/wallet - (auth) Displays a user's cosmos address and token balance, a form to send tokens to a username or cosmos address, and also a list of historical transactions
  * /account/settings - (auth) Displays forms to allow users to change their username, avatar, and other application settings.
  * /account/forgot - Displays a form to allow signed-out users to reset their password

### 3.2 App Components

* cardMessage
* cardAccount
* pageHeaderAccount
* appHeader
* appMenu

## 4. Roadmap

See the [roadmap](./roadmap.md).
