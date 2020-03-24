# Dither

Transparent, uncensorable chat. Powered by the Cosmos Hub. Contributions are welcome!

Try it out at [dither.chat](https://dither.chat).

**Dither is experimental software, currently in alpha status**

## Protocol
Dither is a protocol built on top of the Cosmos Hub memo field. When end-users send transaction on the Cosmos Hub with memos in the following JSON format, the Dither indexing server will add the memo to a database. This index of memos, currently built on top of Firestore, is available to be read by any client.

Here's an example Cosmos Hub memo that will be accepted by the Dither indexing server.

```
{
  "type":"comment",
  "parent":"45C00DB63C5A14D7CFEAA9055E21D5E8918F8A7785289AF7D8B4928B9145D7A0",
  "body":"This is a comment on a parent memo."
}
```

Note: To prevent a certain of spam, only transactions that are (1) sent to an official Dither address, and (2) have the correct fee, will be added to the index of memos.
