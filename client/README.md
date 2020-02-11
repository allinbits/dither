# dither-client

> A web client for Dither.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Dither commands

## 0.x commands - MVP
/comment [txhash] [memo] - comment on a memo (start a thread/chain)
/like [txhash] - like a memo
/post [memo] - post a memo
/quote [txhash] - quote a memo
/repost [txhash] - repost a memo

## 1.0 commands - user settings

/setname [username] - set a user's name
/setavatar [image-url] - set a user avatar
/setemail [email] - set a user email address
/setstatus [memo] - set a user status

/auth [cosmos1addr] - associate an address with user
/block [cosmos1addr] [cosmos1addr] ... - block one or more addresses
/tip [txhash] - tip a memo with ATOM

## 2.0 commands - following & unfollowing

/follow [cosmos1addr] - follows an address
/unfollow [cosmos1addr] - unfollows an address

## 3.0 commands

/join [channel] - join a channel
/quit [channel] - quit a channel
/survey [poll] [option1] [option2] ...
/whisper [cosmos1addr] [memo] - encrypted direct message