
function donateMoney() {  
  // var address = document.getElementById("address").innerHTML;
  alert("Thank you for your donation!" + "\n \nThe tip will be send to: " + getPublicAddress())
  printXrpConnection()
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

function getAccountInfo() {
  document.getElementById("accounInfo").innerHTML = browser.tabs.executeScript({file: "my_ripple_experiment\get-account-info.js"})
  .then(listenForClicks)
  .catch(reportExecuteScriptError);;
}

document.getElementById("balance").addEventListener("click", printXrpConnection);