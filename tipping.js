askForTipping()
//showCorrectDiv()

function getUserData() {
    var userData = {}
    userData.publicAddress = sessionStorage.getItem('publicAddress')
    userData.privateKey = sessionStorage.getItem('privateKey')
    return userData;
}

async function donateMoney() {  
  document.getElementById('ValidationText').innerHTML = "";
  var amountval = document.getElementById("amount").value;
  console.log("amount " + amountval)
  // First check if the amount of tip is a valid number(Integer, Float)
  if(!(amountval.match(/^-{0,1}\d+$/) || amountval.match(/^\d+\.\d+$/)) || amountval == 0){
    alert("Please insert a valid number.")
  } else {
    // Retrieve the currency selected by the user.
    var e = document.getElementById("ddlViewBy");
    var strUser = e.value
    
    // Switch case user has either selected USD, EUR or XRP. and for each case the amount is converted
    // to XRP and a custom confirmation screen is shown for each selected currency.
    switch (String(strUser)) {
      case "EUR":
        newAmountVal = await exchangeRate(amountval, 'https://www.bitstamp.net/api/v2/ticker/xrpeur/', "EUR ")
        var confirmation = confirm("please confirm that you want to tip " + amountval + " EUR?" + " This will be done by tipping " + newAmountVal + " in XRP." + "\n \nThe tip will be send to: " + getPublicAddressWebpage())
        break;
      case "USD":
        newAmountVal = await exchangeRate(amountval, 'https://www.bitstamp.net/api/v2/ticker/xrpusd/' , 'USD ')
        var confirmation = confirm("please confirm that you want to tip " + amountval + " USD?" + " This will be done by tipping " + newAmountVal + " in XRP." + "\n \nThe tip will be send to: " + getPublicAddressWebpage())
        break;
      case "XRP":
        newAmountVal = amountval
        console.log("The to be donated amount in XRP: " + newAmountVal)
        var confirmation = confirm("please confirm that you want to tip " + newAmountVal + " XRP?" + "\n \nThe tip will be send to: " + getPublicAddressWebpage())
        break;
    }

    // Check if user really wants to tip x to the webpage
    if (confirmation) {
      var userData = {}
      userData = getUserData()
      printXrpConnection(userData)
      document.getElementById("donateButton").disabled = true;
      // Start transaction
      doTransaction(getPublicAddressWebpage(), userData['publicAddress'], userData['privateKey'], newAmountVal)
    }
  }
}

// Funtion to get a specifc meta value
function getPublicAddressWebpage() {
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === 'Tudelft-tipping-extension') {
      return metas[i].getAttribute('content');
    }
  }
  return 'The public address of this webpage is not found';
}

// Function used to convert the amount from either USD or EUR to XRP.
async function exchangeRate(amount, url, currency) {
  // The exchange rate is requested from the url.
  response = await fetch(url)
  resjson = await response.json()   
  console.log('The exchange rate from XRP to ' + currency +  Number(resjson.last))
        
  // The exchange rate is converted from XRP to USD/EUR, to USD/EUR to XRP.
  eRate = 1 / Number(resjson.last)
  console.log('The exchange rate from ' + currency + 'to XRP ' + eRate)
        
  // Calculate and return the amount in XRP
  newRate = eRate * amount
  newRate = newRate.toFixed(2)
  console.log("The to be donated amount in XRP: " + newRate)

  return newRate
}

// Method to check wheter the user has uploaded their files
function showCorrectDiv(){
  userData = getUserData()
  pKey = userData['privateKey']
  pAddress = userData['publicAddress']
  if(pAddress != null && pKey != null && pAddress != 'pAddress' && pKey != 'pKey') {
    // Tipping could be done
    showTipDiv()
  } else {
    // Upload of files need to be done first
    showUploadDiv()
  }
}

function askForTipping(){
    const metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === 'Tudelft-tipping-extension') {
            var getHtmlBanner = browser.runtime.getURL("html/banner.html");
            $('#popupContainer').load(getHtmlBanner, function() {
            //When loaded. load event handlers
            document.getElementById("confirmButton").addEventListener("click", showCorrectDiv);
            document.getElementById("close").addEventListener("click", function(){
            document.getElementById("toolbar").style.display = 'none';});
            });
        }
    }
}

// Show div to upload files(public address and private key)
function showUploadDiv() {
  var getHtmlUpload = browser.runtime.getURL("html/upload.html");
  $('#popupContainer').load(getHtmlUpload, function() {
    // When loaded, load event handlers
    document.getElementById('publicAddress').addEventListener('change', readAllFiles, false);
    document.getElementById('privateKey').addEventListener('change', readAllFiles, false);
    document.getElementById("uploadButton").addEventListener("click",showTipDiv);
  });

}

// Show the div to tip the webpage
function showTipDiv() {
  var getHtmlTip = browser.runtime.getURL("html/tip.html");
  $('#popupContainer').load(getHtmlTip, function() {
    // When loaded, load event handlers
    document.getElementById('donateButton').addEventListener('click', donateMoney);
  });
}


// Method to read the data of the txt file => in the future upload path
function readAllFiles(evt) {
  var files = evt.target.files, i = 0, r, f;
  if(files[0]){
    f=files[0]
    r = new FileReader();
    r.onload = (function(f){
      return function(e){
        console.log("Before " + sessionStorage.getItem('publicAddress'))
        console.log("Before " + sessionStorage.getItem('privateKey'))
        // Set the correct key, value
        sessionStorage.setItem(String(evt.originalTarget.id), e.target.result);
        console.log("After " + sessionStorage.getItem('publicAddress'))
        console.log("After " + sessionStorage.getItem('privateKey'))
        };
      })(f);
      r.readAsText(f);
    }
    else {
      alert("Error loading files");
    }
}
