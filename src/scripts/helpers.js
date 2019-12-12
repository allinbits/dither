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
export default { getTxSender, truncAddress };
