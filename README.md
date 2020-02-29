# Dither

Transparent, uncensorable chat. Powered by the Cosmos Hub. Contributions are welcome!

Try it out at [dither.chat](https://dither.chat).

**experimental software**

## API
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

## Roadmap

### MVP commands

```
comment [txhash] [memo] - comment on a memo (start a thread/chain)
like [txhash] - like a memo
post [memo] - post a memo
repost [txhash] - repost a memo
```

### User settings

```
setname [username] - set a user's name
setavatar [image-url] - set a user avatar
setemail [email] - set a user email address
setstatus [memo] - set a user status
auth [cosmos1addr] - associate an address with user
block [cosmos1addr] [cosmos1addr] ... - block one or more addresses
tip [txhash] - tip a memo with ATOM
```

### Following & unfollowing

```
follow [cosmos1addr] - follows an address
unfollow [cosmos1addr] - unfollows an address
```

### Futher onwards

```
quote [txhash] - quote a memo
join [channel] - join a channel
quit [channel] - quit a channel
survey [poll] [option1] [option2] ...
whisper [cosmos1addr] [memo] - encrypted direct message
```
