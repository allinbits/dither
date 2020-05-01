# Dither Software Design Document

## 1. Goals & Vision

Dither is a collection of open source components that works together to enable an uncensorable and decentralized social network for web and mobile devices. User interaction on Dither is powered by the Cosmos Hub blockchain. User data is stored in an SQL database that is written to by a transaction indexing tool that we create.

Dither is made up of these components:

* Dither Blockchain
* Dither Indexer
* Dither Web Client
* Dither iOS Client
* Dither Android Client

### 1.1 Business Goals

The long term vision of Dither is a self-sustaining community of engaged users and volunteer developers who together run an uncensorable and decentralized social network.

The vision of Virgo is to provide the world with the best open collaboration technology. Without Dither, the Virgo community would be bereft of a resilient means of communicating across the world without censorship.

Today's social networks are means for the majority of humanity to communicate with their local and global communities. But these networks are owned by corporations that serve their shareholders, and not their billions of users. It is the mission of Dither to solve the issue of centralized power and censorship created by current social networks. We hope to offer to users of Dither their own sovereign channel of communication to the world without fearing for censorship or bans.

### 1.2 Business Needs

#### 1.2.1 User Personas

#### 1.2.2 Defining Success

There are multiple levels of success for Dither. Level 1 is usage - if have a healthy population who log into Dither on a daily basis, we can say we've suceeded on one level. Level 2 is developers - if we have a healthy ecosystem of developers who use Dither, we can say we've succeeded on higher level. Level 3 is sustainability - if Dither becomes a self-governed social network, we can say we've made it.

## 2. Requirements/System Overview

### 2.1 User Requirements
There will be different types of users who may use Dither. Here are some examples personas:

#### 2.1.1 Dither Developer
#### 2.1.2 ATOM Holder
#### 2.1.3 Blockchain Enthusiast
#### 2.1.4 Mainstream Tech Enthusiast

### 2.2 Functional Requirements

Dither is made up of three primary components. The blockchain component, the indexer component, and a client component. In case this, we propose maintaining three interchangable client components, for the web, iOS, and Android.

#### 2.2.1 Dither Blockchain

Dither is a social network powered by blockchain technology. Currently, this is the Cosmos Hub blockchain. We expect that with future growth, we will strain the limits of the transaction throughput on the Cosmos Hub. Well, either that or the transactions will be too expensive to combat the greater usage. The long-term goal of Dither is to put it onto its own application-specific blockchain.

##### 2.2.1.1 Dither on the Cosmos Hub

For the first year of development

##### 2.2.1.2 Dither on an application-specific blockchain

#### 2.2.2. Dither Indexer

The Dither Indexer is a database that interacts with a Cosmos Hub full node to query for and store information. It is the primary data store for Dither and is queried by various front-ends to allow users to sign up, login, view, send, and query for messages.

#### 2.2.3 Dither Client

THe Dither client is a cod

##### 2.2.3.1 Dither Web
The Dither Web Client is a graphical user interface built with modern web technologies. It is the first client that we will build for Dither, and it will serve as the reference implementation for the iOS and Android applications.

#### 2.2.3.2 Dither iOS
The iOS Client is a full-featured Dither application for recent iOS devices.

#### 2.2.3.3 Dither Android
The Android Client is a full-featured Dither application for recent Android devices.

## 3. Dither Client Specification

### 3.1 Routes

Note that `(auth)` means that the user needs to be logged in, and that `(no-ui)` means this route doesn't have a page associated with it, and it should redirect the user to another page.

* /explore - The homepage for signed out users. Encourages users to sign up for a new account.
* /welcome - (no-ui) This is the signup flow for new users
  * /welcome/signup - First step of signup, accepts a username and password.
      * Field -Username
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

### 3.2 Components

* cardMessage
* cardAccount
* pageHeaderAccount
* appHeader
* appMenu

## 4. Roadmap

See the [roadmap](./roadmap.md).
