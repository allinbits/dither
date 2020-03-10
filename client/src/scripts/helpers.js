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
function truncAddress(addr) {
  if (addr) {
    let value = addr.slice(7, addr.length);
    return value.slice(value.length - 8, value.length);
  } else {
    return "N/A";
  }
}

export default { getDisplayName, getMemoPrefix, getTxSender, truncAddress };
