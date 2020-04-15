// When DTS is running the first thing done for each website is calling.
// the function askForTipping().
askForTipping()

// Function called when the user wants to donate an amount. The amount gets checked for validity.
// and a confirmation message is created and shown to the user. If the user accepts the actual transaction is
// started by calling doTransaction().
async function donateMoney() {
  document.getElementById('ValidationText').innerHTML = "";
  document.getElementById('TwitterButton').style.display = 'none';
  var amountval = document.getElementById("amount").value;
  console.log("amount " + amountval)
  // First check if the amount of tip is a valid number(Integer, Float)
  if(!(amountval.match(/^-{0,1}\d+$/) || amountval.match(/^\d+\.\d+$/)) || amountval <= 0){
    alert("Please insert a valid number.")
  } else {
    // Retrieve the currency selected by the user.
    var e = document.getElementById("ddlViewBy");
    var strUser = e.value    
    // Switch case user has either selected USD, EUR or XRP. and for each case the amount is converted
    // to XRP and a custom confirmation screen is shown for each selected currency.
  
    var confirmationMessage = ''
    var newAmountVal = 0
    switch (String(strUser)) {
      // Case for if the user filled in their amount in Euros. convert the amount to XRP and create a confirmation message.
      case "EUR":
        newAmountVal = await exchangeRate(amountval, 'https://www.bitstamp.net/api/v2/ticker/xrpeur/', "EUR ")
        confirmationMessage = "Please confirm that you want to tip " + amountval + " EUR?" + " This will be done by tipping " + newAmountVal + " in XRP." + "\n \nThe tip will be send to: " + getPublicAddressWebpage();
        break;
      // Case for if the user filled in their amount in USD. convert the amount to XRP and create a confirmation message.  
      case "USD":
        newAmountVal = await exchangeRate(amountval, 'https://www.bitstamp.net/api/v2/ticker/xrpusd/' , 'USD ')
        confirmationMessage = "Please confirm that you want to tip " + amountval + " USD?" + " This will be done by tipping " + newAmountVal + " in XRP." + "\n \nThe tip will be send to: " + getPublicAddressWebpage();
        break;
      // Case for if the user filled in their amount in XRP. no conversion is needed so only the confirmation message is created.  
      case "XRP":
        newAmountVal = amountval
        confirmationMessage = "Please confirm that you want to tip " + newAmountVal + " XRP?" + "\n \nThe tip will be send to: " + getPublicAddressWebpage();
        break;
    }
    var confirmation = false
    if(checkMinAmount(newAmountVal)) {
      confirmation = confirm(confirmationMessage)
    } else {
      alert("The selected amount is below the minimum of 0.000001 XRP")
    }
    // Check if user really wants to tip x to the webpage
    if (confirmation) {
      // printXrpConnection()
      document.getElementById("donateButton").disabled = true;
      // Start transaction
      document.getElementById('ValidationText').style="color:blue"
      document.getElementById('ValidationText').innerHTML = "The transaction is in progress...";
      doTransaction(getPublicAddressWebpage(), newAmountVal)
    }
  }
}

// Function used to check if the amount filled in by the user is large enough for 
// a succesful transaction. (no negative amounts are allowed for example).
function checkMinAmount(amount) {
  if(amount >= 1e-6) { 
    return true
  } else {
    return false
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
  newRate = newRate.toFixed(6)
  console.log("The to be donated amount in XRP: " + newRate)

  return newRate
}

// Method to check wheter the user has uploaded their files
async function showCorrectDiv(){
  // Get credentials
  senderAddress = await getCredentials('publicAddress.txt')
  privateKey = await getCredentials('privateKey.txt')
  if(senderAddress == 0 || privateKey == 0) {
    // Upload of files need to be done first
     showUploadDiv()
  } else {
    // Tipping could be done
     showTipDiv()
  }
}

// First function called when the DTS is running. It checks the website allows for transactions.
// If the website does show the html banner.
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
    document.getElementById("uploadButton").addEventListener("click", showTipDiv);
  });
}

// Show the div to tip the webpage
async function showTipDiv() {
  // Reset error message
  senderAddress = await getCredentials('publicAddress.txt')
  privateKey = await getCredentials('privateKey.txt')

  if(senderAddress != 0 && privateKey != 0) {
    var getHtmlTip = browser.runtime.getURL("html/tip.html");
    $('#popupContainer').load(getHtmlTip, function() {
      document.getElementById('TwitterButton').style.display = 'none';
      // When loaded, load event handlers
      document.getElementById('donateButton').addEventListener('click', donateMoney);
    });
  } else {
    document.getElementById('ValidationTextUpload').innerHTML = "";
    // Check if files are uploaded
    
    if(senderAddress == 0 || privateKey == 0) {
      document.getElementById('ValidationTextUpload').innerHTML = "One of the files was not uploaded succesfully. Please try again.";
    }
  }
}



// Method to read the data of the txt file => in the future upload path
function readAllFiles(evt) {
  if( document.getElementById(evt.originalTarget.id).files.length == 0 ){
    console.log(evt.originalTarget.id)
    document.getElementById('ValidationTextUpload').innerHTML = "Please upload";
  } else {
    var files = evt.target.files, i = 0, r, f;
    if(files[0]){
      f=files[0]
      r = new FileReader();
      r.onload = (function(f){
        return function(e){
          // Set the path of the file
          insertDataStorage(String(evt.originalTarget.id), e.target.result)
          };
        })(f);
        r.readAsText(f);
      }
      else {
        alert("Error loading files");
      } 
  }
}

// Function used by readAllFiles() to store the user credentials in new files.
// that will be accessed by the browser when needed.
async function insertDataStorage(filename, value) {
  filename = filename + ".txt"
  const tmpFiles = await IDBFiles.getFileStorage({name: "tmpFiles"});
  var path = browser.runtime.getURL("/keys/" + filename);
  const file = await tmpFiles.createMutableFile(path);
  const fh = file.open("readwrite");   
  await fh.append(value);
  await fh.close();
  await file.persist();
}
