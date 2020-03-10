
function donateMoney() {  
  // var address = document.getElementById("address").innerHTML;
  alert("Thank you for your donation!" + "\n \nThe tip will be send to: " + getPublicAddress())
  printXrpConnection()
  doTransaction(getPublicAddress())
}

function printXrpConnection() {
  var api = new ripple.RippleAPI({server:'wss://s1.ripple.com/'});
  api.connect().then(function() {
      return api.getServerInfo();
  }).then(function(server_info) {
  document.body.innerHTML += "<p>Connected to rippled server!</p>" +
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

// Funtion to get a specifc meta value
function getPublicAddress() {
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === 'Tudelft-tipping-extension') {
      return metas[i].getAttribute('content');
    }
  }
  return 'The public address of this webpage is not found';
}

document.getElementById("popupContainer").innerHTML = `<div class="popup" style="position: absolute;  top: 80px;
right: 80px; width:40%;">
<div style="position:absolute; top: 50%;left: 50%; border-style: solid; background-color: lightblue;">
  <span class="popuptext" id="myPopup" style"text-align:center;"><b>Do you want to tip?</b></span>
  <br>
  <button type = "button" id = "donateButton"> Tip here </button>  
  </span>
  </div>
</div>`;

document.getElementById("donateButton").addEventListener("click", donateMoney);