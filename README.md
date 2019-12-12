# depth-client

> A web client for Depth.

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

## Depth commands

## 0.x commands - MVP
/b [cosmos1addr] [cosmos1addr] ... - block one or more addresses
/c [txhash] [memo] - comment on a memo (start a thread/chain)
/l [txhash] - like a memo
/q [txhash] - quote a memo with user's own memo
/r [txhash] - relay (aka retweet) a memo
/s [memo] - publish a memo

## 1.0 commands - user settings

/setusername [username] - set a username
/setavatar [image-url] - set a user avatar
/setemail [email] - set a user email address
/setstatus [memo] - set a user status
/auth [cosmos1addr] - associate an address with user
/tip [txhash] - tip a memo with ATOM

## 2.0 commands - following & unfollowing

/follow [cosmos1addr] - follows an address
/unfollow [cosmos1addr] - unfollows an address

## 3.0 commands - more fun features

/join [channel] - join a channel
/leave [channel] - leave a channel
/poll [poll] [option1] [option2] ...
/shrug [memo> - adds ¯\_(ツ)_/¯ to the end of your memo
/tell [cosmos1addr] [memo] - direct message
/whisper [cosmos1addr] [memo] - encrypted direct message
