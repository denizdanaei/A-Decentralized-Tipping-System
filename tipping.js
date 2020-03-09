
function donateMoney() {  
  // var address = document.getElementById("address").innerHTML;
  alert("Thank you for your donation!" + "\n \nThe tip will be send to: " + getPublicAddress())
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