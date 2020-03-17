showCorrectDiv()

function getUserData() {
    var userData = {}
    userData.publicAddress = sessionStorage.getItem('publicAddress')
    userData.privateKey = sessionStorage.getItem('privateKey')
    return userData;
}

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
      var userData = {}
      userData = getUserData()
      printXrpConnection(userData)
      document.getElementById("donateButton").disabled = true;
      // Start transaction
      doTransaction(getPublicAddressWebpage(), userData['publicAddress'], userData['privateKey'], amountval)
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

// Show div to upload files(public address and private key)
function showUploadDiv() {
  document.getElementById("popupContainer").innerHTML = `
  <div class="popup" style="position: absolute;  top: 20px; right: 0px; width:60%;">
  <div style="position:absolute; top: 50%;left: 50%; border-style: solid; background-color: lightblue; padding:10px">
  <span class="popuptext" id="myPopup" style"text-align:center;"><b> Please upload two files(public address, private key) </b></span>
  <br>
  <br>
  <label for="pAddress">Public address:</label>
  <input type="file" id="publicAddress" name="publicAddress" accept=".txt">
  <br>
  <label for="pKey">Private address:</label>
  <input type="file" id="privateKey" name="privateKey" accept=".txt">
  <br>
  <br>
  <button type = "button" id = "uploadButton"> Upload </button>  
  </span>
  </div>
  </div>`;

  document.getElementById('publicAddress').addEventListener('change', readAllFiles, false);
  document.getElementById('privateKey').addEventListener('change', readAllFiles, false);
  document.getElementById("uploadButton").addEventListener("click", showTipDiv);
}

// Show the div to tip the webpage
function showTipDiv() {
  document.getElementById("popupContainer").innerHTML = `<div class="popup" style="position: absolute;  top: 20px;
  right: 0px; width:40%;">
  <div style="position:absolute; top: 50%;left: 50%; border-style: solid; background-color: lightblue;  padding:10px">
  <span class="popuptext" id="myPopup" style"text-align:center;"><b>Do you want to tip?</b></span>
  <br>
  <input type = "number" name = "amount" id = "amount" placeholder = "0"></input>
  <button type = "button" id = "donateButton"> Tip here </button>  
  </span>
  </div>
  </div>`;
  document.getElementById('donateButton').addEventListener('click', donateMoney);
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