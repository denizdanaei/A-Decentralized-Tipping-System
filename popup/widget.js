
function donateMoney() {  
  // var address = document.getElementById("address").innerHTML;
  alert("Thank you for your donation!" + "\n \nThe tip will be send to: " + getPublicAddress())
  printXrpConnection()
  // doTransaction(getPublicAddress())
}
function printXrpConnection() {
  console.log(ripple);
  var api = new ripple.RippleAPI({server:'wss://s1.ripple.com/'});
  api.connect().then(function() {
    return api.getServerInfo();
  }).then(function(server_info) {
    document.getElementById("accounInfo").innerHTMLdocument.body.innerHTML += "Connected to rippled server!"});

}





function getAccountInfo() {
  document.getElementById("accounInfo").innerHTML = browser.tabs.executeScript({file: "my_ripple_experiment\get-account-info.js"})
  .then(listenForClicks)
  .catch(reportExecuteScriptError);;
}

document.getElementById("balance").addEventListener("click", printXrpConnection);