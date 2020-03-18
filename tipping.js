
showCorrectDiv()

function donateMoney() {  
  var amountval = document.getElementById("amount").value;
  console.log("amount " + amountval)
  // First check if the amount of tip is a valid number(Integer, Float)
  if(!(amountval.match(/^-{0,1}\d+$/) || amountval.match(/^\d+\.\d+$/)) || amountval == 0){
    alert("Please insert a valid number.")
  } else {
    var confirmation = confirm("Are you sure you want to tip " + amountval + " XRP?" + "\n \nThe tip will be send to: " + getPublicAddressWebpage())
    // Check if user really wants to tip x to the webpage
    if (confirmation) {
      printXrpConnection()
      document.getElementById("donateButton").disabled = true;
      // Start transaction
      doTransaction(getPublicAddressWebpage(), amountval)
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

// Method to check wheter the user has uploaded their files
async function showCorrectDiv(){
  // Get credentials
  senderAddress = await getCredentials('publicAddress.txt')
  privateKey = await getCredentials('privateKey.txt')
  if(senderAddress != null && privateKey != null) {
    // Tipping could be done
    showTipDiv()
  } else {
    // Upload of files need to be done first
    showUploadDiv()
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