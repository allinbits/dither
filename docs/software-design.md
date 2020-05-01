# Dither Software Design Document

## I. Goals & Vision

Dither is a collection of open source components that works together to enable an uncensorable and decentralized social network for web and mobile devices. User interaction on Dither is powered by the Cosmos Hub blockchain. User data is stored in an SQL database that is written to by a transaction indexing tool that we create.

Dither is made up of these components:

* Dither Blockchain
* Dither Indexer
* Dither Web Client
* Dither iOS Client
* Dither Android Client

### 1. Business Goals

The long term vision of Dither is a self-sustaining community of engaged users and volunteer developers who together run an uncensorable and decentralized social network.

The vision of Virgo is to provide the world with the best open collaboration technology. Without Dither, the Virgo community would be bereft of a resilient means of communicating across the world without censorship.

Today's social networks are means for the majority of humanity to communicate with their local and global communities. But these networks are owned by corporations that serve their shareholders, and not their billions of users. It is the mission of Dither to solve the issue of centralized power and censorship created by current social networks. We hope to offer to users of Dither their own sovereign channel of communication to the world without fearing for censorship or bans.

### 2. Business Needs

#### i. User Personas

#### ii. Defining Success

There are multiple levels of success for Dither. Level 1 is usage - if have a healthy population who log into Dither on a daily basis, we can say we've suceeded on one level. Level 2 is developers - if we have a healthy ecosystem of developers who use Dither, we can say we've succeeded on higher level. Level 3 is sustainability - if Dither becomes a self-governed social network, we can say we've made it.

## II. Requirements/System Overview

### 1. User Requirements
There will be different types of users who may use Dither. Here are some examples personas:

#### i. Dither Developer
#### ii. ATOM Holder
#### iii. Blockchain Enthusiast
#### iv. Mainstream Tech Enthusiast

### 2. Functional Requirements

#### i. Dither Blockchain

Dither is a social network powered by blockchain technology. Currently, this is the Cosmos Hub blockchain. We expect that with future growth, we will strain the limits of the transaction throughput on the Cosmos Hub. Well, either that or the transactions will be too expensive to combat the greater usage. The long-term goal of Dither is to put it onto its own application-specific blockchain.

#### ii. Dither Indexer

The Dither Indexer is a database that interacts with a Cosmos Hub full node to query for and store information. It is the primary data store for Dither and is queried by various front-ends to allow users to sign up, login, view, send, and query for messages.

#### iii. Dither Web Client

The Dither Web Client is a full-featured graphical user interface for Dither.

#### iv. Dither iOS Client

The iOS Client is a full-featured Dither application for recent iOS devices.

#### v. Dither Android Client

The Android Client is a full-featured Dither application for recent Android devices.

## III. User Interface

### 1. Dither Web Client

#### Routes

Note that `(auth)` means that the user needs to be logged in, and that `(no-ui)` means this route doesn't have a page associated with it, and it should redirect the user to another page.

* /welcome - This is the default homepage for non-signed in users
  * /welcome/signup - First step of signup, accepts a username and password.
  * /welcome/wallet - Second step signup that creates a wallet for the user
  * /welcome/tokens - Third step signup that somehow gives tokens to the user
  * /welcome/follow - Fourth step of signup that encourages the user to follow some accounts.
* /login - Displays a form to allow a registered user to authenticate to the app.
* /index - Displays recent messages posted by signed-in users's following
* /accounts - (no-ui)
  * /accounts/:account - Displays recent messages posted by a specific account.
  * /accounts/:account/messages/:message - Displays a specific message posted by a specific account.
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

#### Components

* message
* account
* app-header
* app-menu

### 2. Dither iOS Client
### 3. Dither Android Client
