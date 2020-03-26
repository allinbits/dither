import { formatDistanceStrict } from "date-fns";
import linkifyHtml from "linkifyjs/html";

function getDisplayName(accounts, address) {
  if (accounts && accounts[address] && accounts[address].displayname) {
    return accounts[address].displayname;
  }
  return "Anonymous";
}

function getMemoPrefix(type, parentAddress) {
  switch (type) {
    case "comment":
      return `/c ${parentAddress} `;
    case "like":
      return `/l ${parentAddress} `;
    case "quote":
      return `/q ${parentAddress} `;
    case "repost":
      return `/r ${parentAddress} `;
    default:
      return "/p ";
  }
}

function getTxSender(tx) {
  let sender = "Loading...";
  if (tx) {
    let txEventMessage = tx.events.find(e => e.type === "message");
    let txEventMessageAttribute = txEventMessage.attributes.find(
      a => a.key === "sender"
    );
    sender = txEventMessageAttribute.value;
  }
  return sender;
}

function linkifyMemo(text) {
  return linkifyHtml(text, {
    formatHref: (href, type) => {
      if (type === "hashtag") {
        href = "https://dither.chat/channels/" + href.substring(1);
      }
      return href;
    },
    ignoreTags: ["script", "style"]
  });
}

function timeAgo(timestamp) {
  let value = "";
  if (timestamp) {
    value = formatDistanceStrict(new Date(timestamp), new Date());
    // an ugly hack to replace longer strings with the short form
    value = value.replace(" seconds", "s");
    value = value.replace(" second", "s");
    value = value.replace(" minutes", "m");
    value = value.replace(" minute", "m");
    value = value.replace(" hours", "h");
    value = value.replace(" hour", "h");
    value = value.replace(" days", "d");
    value = value.replace(" day", "d");
    value = value.replace(" weeks", "w");
    value = value.replace(" week", "w");
    value = value.replace(" months", "m");
    value = value.replace(" month", "m");
    value = value.replace(" years", "y");
    value = value.replace(" year", "y");
    return value;
  }
  return "";
}

function truncAddress(addr) {
  if (addr) {
    let value = addr.slice(7, addr.length);
    return value.slice(value.length - 8, value.length);
  } else {
    return "N/A";
  }
}

export default {
  getDisplayName,
  getMemoPrefix,
  getTxSender,
  linkifyMemo,
  timeAgo,
  truncAddress
};
