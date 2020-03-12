
function donateMoney() {  
  

  document.getElementById("donated").innerHTML = "tiped!"
  
  // var address = document.getElementById("address").innerHTML;
  document.getElementById("donated").innerHTML = "Thank you for your donation!" + "\n \nThe tip will be send to: " + getPublicAddress()
  // printXrpConnection()
  // doTransaction(getPublicAddress())
}
function printXrpConnection() {
  var api = new ripple.RippleAPI({server:'wss://s1.ripple.com/'});
  api.connect().then(function() {
      return api.getServerInfo();
  }).then(function(server_info) {
    document.getElementById("accounInfo").innerHTML = 
   "<p>Connected to rippled server!</p>" +
"      <table>" +
"        <tr><th>Version</th>" +
"          <td>" + server_info.buildVersion + "</td></tr>" +
"        <tr><th>Ledgers available</th>" +
"          <td>" + server_info.completeLedgers + "</td></tr>" +
"        <tr><th>hostID</th>" +
"          <td>" + server_info.hostID + "</td></tr>" +
"        <tr><th>Most Recent Validated Ledger Seq.</th>" +
"          <td>" + server_info.validatedLedger.ledgerVersion + "</td></tr>" +
"        <tr><th>Most Recent Validated Ledger Hash</th>" +
"          <td>" + server_info.validatedLedger.hash + "</td></tr>" +
"        <tr><th>Seconds since last ledger validated</th>" +
"          <td>" + server_info.validatedLedger.age + "</td></tr>" +
"      </table>";
  });
}

document.getElementById("balance").addEventListener("click", printXrpConnection);

// Funtion to get a specifc meta value
function getPublicAddress() {
  console.log(document);
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === 'Tudelft-tipping-extension') {
      return metas[i].getAttribute('content');
    }
  }
  return 'The public address of this webpage is not found';
}

document.getElementById("tip").addEventListener("click", donateMoney);

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/test_script.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);