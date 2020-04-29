# Dither Roadmap

This is the current software development roadmap for Dither. We plan to start official development in Q2 2020, and the estimated end date is Q2 2022.

## First six months

[**Dither Proof-of-Concept**](./roadmap-01-poc.md) - We will work on a proof-of-concept version of Dither and deploy it publicly to the Cosmos community. The POC feature set is unstable and continues to change as we move quickly through iterations and feedback rounds. This POC will inform us on the feasibility of Dither, possible scaling concerns, and also gather invaluable feedback from the community. We will publish the POC on GitHub. (S)

[**Dither Protocol Specification (alpha)**](./roadmap-02-spec.md) - We will research, design, and publish a messaging protocol for Dither, built on top of the Cosmos Hub memo field, with future support for IBC  in mind. We will publish the alpha protocol spec on GitHub. (S)

[**Dither Indexer (alpha)**](./roadmap-03-indexer.md) - The indexer will save all Cosmos Hub txs that are valid Dither txs. It will also continuously monitor the blockchain for new memos. The REST interface will allow for viewing, filtering, searching across txs, as well as support off-chain user account features. We will publish the Dither Indexer on GitHub. (M)

[**Dither Web Client (alpha)**](./roadmap-04-webapp.md) - We will deliver a Dither web application that supports mobile and desktop devices. It will support subset of the MVP features that have defined for Dither via the protocol and indexer. We will publish the alpha web client GitHub. (M)

## Second six months

[**Dither Protocol Specification (beta)**](./roadmap-05-spec.md) - We will continue working on on the Dither protocol specification. This will culminate in a beta release within the first year. We will attempt a feature freeze in preparation for the beta releases of the indexer and the web client. We will publish this beta release on GitHub. (S)

[**Dither Indexer (beta)**](./roadmap-06-indexer.md) - Based on the beta protocol specification, we will continue updating, testing, and securing the Dither Indexer. These changes should increase the feature set of the indexer, improve test coverage, and also should improve performance. This will culminate in a beta release on GitHub. (M)

[**Dither Web Client (beta)**](./roadmap-07-webapp.md) - We will continue to fix bugs, improve performance, accessibility, and add features to the web client. This will culminate in a beta release on GitHub. (L)

[**Dither Website (alpha)**](./roadmap-08-website.md) - We will start designing and developing a marketing site for Dither. There will be two distinct audiences: (1) Dither application developers and (2) Dither users. This website will be deployed and source code will be available on GitHub. (S)

## Third six months 

[**Dither Blockchain Research**](./roadmap-09-blockchain.md) - Depending on the throughput of the Cosmos Hub and the traction of Dither, we may be forced to move onto a separate blockchain. We will research and define the work required to convert Dither into a custom blockchain application (likely built on the Cosmos SDK). We'll publish this research and development plan on GitHub. (M) 

[**Dither iOS Client (alpha)**](./roadmap-10-ios.md) - We will start designing and building an iOS application for Dither. Initially, it will support recent versions of iPhones and iPod touch devices. We will publish the source on GitHub and deploy via TestFlight. (L)

[**Dither Android Client (alpha)**](./roadmap-11-android.md) - We will start designing and building an Android application for Dither. Initially, it will support recent versions of popular Android phones. We will publish the source on GitHub and deploy via Google Play Beta. (L)

[**Dither Documentation (alpha)**](./roadmap-12-docs.md) - We will write documentation for the Dither protocol and indexer. We will also provide tutorials for application developers to implement Dither protocol support. We will publish these docs on GitHub. (S)

## Fourth six months

[**Dither Blockchain (testnet)**](./roadmap-13-blockchain.md) - Dither will likely overload the Cosmos Hub with fluff transactions. Based on the research we conducted earlier, we will build Dither as a custom Cosmos SDK-based application. We will publish the source on GitHub and will launch at least one testnet. (M) 

[**Dither iOS Client (beta)**](./roadmap-14-ios.md) - We will continue maintaining and improving the iOS application for Dither. During this beta phase, we expect that that Dither iOS will support all the MVP features. We will publish the source on GitHub and deploy via TestFlight. (L)

[**Dither Android Client (beta)**](./roadmap-15-android.md) - We will continue maintaining and improving the iOS application for Dither. During this beta phase, we expect that that Dither iOS will support all the MVP features. We will publish the source on GitHub and deploy via Google Play Beta. (L)

[**Dither Website (beta)**](./roadmap-16-website.md) - We will continue maintaining the Dither website. We will continue to update site content based on user feedback & research, roadmap clarity, etc. We will publish the source on GitHub. (S)

[**Dither Documentation (beta)**](./roadmap-17-docs.md) - We will continue maintaining Dither documentation and updating content based on developer feedback, feature improvements, new tutorials, etc. We will publish the source on GitHub. (S)
