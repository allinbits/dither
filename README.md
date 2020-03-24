# Dither

Transparent, uncensorable chat, powered by the Cosmos Hub. [Try it out](https://dither.chat).

**Dither is experimental software, currently in alpha status**

## How does Dither work?

Dither is a protocol built on top of the Cosmos Hub memo field. When accounts send transaction on the Cosmos Hub with memos in the following JSON format, the Dither Indexer will add the memo to a database. This database of memos, (currently built with Firestore), is available to be read by any client.

Here's an example Cosmos Hub memo that will be accepted by the Dither Indexer.

```
{
  "type":"comment",
  "parent":"45C00DB63C5A14D7CFEAA9055E21D5E8918F8A7785289AF7D8B4928B9145D7A0",
  "body":"This is a comment on a parent memo."
}
```

Note: To prevent a certain level of spam, only transactions that are (1) sent to an official Dither address, and (2) have the correct fee, will be added to the index of memos.

## Contributions

Dither is initially being built by employees at [Tendermint Inc](https://tendermint.com), as part of the [Virgo](https://virgo.org) project. We're hard at work fufilling the [initial roadmap](./docs/roadmap.md). In the near future, we will be hiring full-time employees to work on Dither.

Contributors who wish to improve upon Dither are welcome to create issues and pull requests!
