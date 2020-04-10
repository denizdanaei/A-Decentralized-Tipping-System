function API(url) {
    return new ripple.RippleAPI({server: url})
}

async function doTransaction(receiverAddress, amount) {
    senderAddress = await getCredentials('publicAddress.txt')
    privateKey = await getCredentials('privateKey.txt')

    // console.log("Public address webpage " + receiverAddress)
    // console.log("Public address user " + senderAddress)
    // console.log("Private key user " + privateKey)
    // console.log("tip amount " + amount)
    
    // For testing overwrite the arguments
    receiverAddress = 'raoeq8pivVwaJoA7medQrBFt6nb5SMLt18'
    senderAddress = 'rPipQJrNtByNFuybUJNQnPGqGfzvKsxx2e'
    privateKey = 'shtpSCSbCFfvyAZLuo7aYutvkkKeu'
   
    //api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
    api = API('wss://s.altnet.rippletest.net:51233')
    var maxLedgerVersion = null
    var txID = null

    //this is pretty much the main function for the transaction. 
    //the first step is to connect to the API server
    api.connect().then(() => {
        console.log('Connected to the API server' + '\n');
        
        //The second step is to check if the user has enough balance on their account
        //to make the tip.
        checkBalance(senderAddress, amount, api).then(array1 => {
            if (array1[0] == true) {
                amount = array1[1]
                console.log(amount)

                //The third step is to create the JSON file used for the transaction
                doPrepare(amount, senderAddress, receiverAddress, api).then(array2 => {  
                console.log(array2)
                //The fourth step is to sign the JSON file with the secret key
                txJSON = array2[0]
                const response = api.sign(txJSON, privateKey)
                txID = response.id
                maxLedgerVersion = array2[1]
                console.log("Identifying hash:", txID)
                const txBlob = response.signedTransaction
                console.log("Signed blob:", txBlob + '\n')
        
                //The fifth step is to take the signed Blob and submit it too the ledger
                doSubmit(txBlob, api).then(earliestLedgerVersion => {
        
                //The transaction has been submitted. this method checks on each ledger update if the transaction.
                //has been accepted. if it has the success is logged and the process is ended    
                validation(earliestLedgerVersion, maxLedgerVersion, txID, api, amount)
        
                }).catch(console.error)

                }).catch(console.error);
            } else {
                //If the user does not have enough balance inform them and exit the function without performing the transaction.
                end("transaction was higher than user balance", api, null)
            }    

        }).catch(console.error);

        }).catch(console.error); 
} 
    // function used to disconnect from the server and end the process
    function end(transactionResult, api, amount) {
        //console.log(api)
        console.log('HELLO')
        api.disconnect().then(() => {
            let successTag = 'SUCCESS';
            console.log('API has disconnected');
            console.log(transactionResult)
            if (transactionResult.includes(successTag))
            { 
                document.getElementById('TwitterButton').style.display = 'inline-block';            
                document.getElementById('TwitterButton').href = "https://twitter.com/intent/tweet/?text=" + "I just donated " + String(amount)  +" XRP to website " + String(window.location.href) 
                                                        + " using the DTS plugin. More info about the plugin is available at:"  +   "&amp;url=https://github.com/denizdanaie/A-Decentralized-Tipping-System/";       
                document.getElementById('ValidationText').style ="color:green"
                document.getElementById('ValidationText').innerHTML = "The transaction was succesfully processed.  <br> You can share your donation on social media.";  

            } else if (transactionResult.includes("transaction was higher than user balance")) {
                document.getElementById('ValidationText').style ="color:red"
                document.getElementById('ValidationText').innerHTML = "Sorry but the transaction was cancelled. <br> Your balance wasn't high enough." +
                                                                       "<br> You can try again if you want.";
            } else if (transactionResult.includes("The validation of the transaction took to long")) {
                document.getElementById('ValidationText').style ="color:red"
                document.getElementById('ValidationText').innerHTML = "Sorry but the transaction was cancelled. <br> The validation process timed out" +
                                                                       "<br> You can try again if you want.";
            } else {
                document.getElementById('ValidationText').style ="color:red"
                document.getElementById('ValidationText').innerHTML = "Unfortunately The transaction was not succesfully processed. error code: " + transactionResult +
                                                                      "<br> You can try again if you want."   
            }
            
            document.getElementById("amount").value = null;
            document.getElementById('donateButton').disabled = false;
            document.getElementById('donateButton').addEventListener('click', donateMoney);
            console.log('button should be reactivated.')
        })
    }
    
    // Helper method that when called forces a wait of a certain amount of milliseconds.
    // This is called when the user doesn't have enough balance, sometimes that check goes so fast
    // that it makes the donation button not trigger any functions anymore. Meaning the user cannot
    // perform another transaction.
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Function used to check if the user has enough balance to make the tip transaction.
    async function checkBalance(senderAddress, amount, api) {
        // Account info is called because it contains the users balance.
        info = await api.getAccountInfo(senderAddress)
        console.log("INFO")
        console.log(info)
        // Check to see if the user has enough balance
        if (Number(info.xrpBalance) >= Number(amount)) {
            // The user has enough balance the transaction can be executed.
            console.log('The account has enough xrp, the transaction can continue.')
            console.log('amount trying to donate in xrp: ' + amount)
            console.log('account balance: ' + info.xrpBalance)
            return [true, amount];
        } else {
            // The user does not have enough balance the transaction must be cancelled
            console.log('The account has too little xrp, cancel the transaction.')
            console.log('amount trying to donate in xrp: ' + amount)
            console.log('account balance: ' + info.xrpBalance)
            await sleep(2000)
            return [false, amount];
        }
    }

    //new function that takes ledger versions. it calls itself every 2000 milliseconds so potentially it checks the same 
    //ledger version twice but that is not a big issue. It only stops calling itself if logtransaction returns true or 
    //after a certain number of ledgers has been validated.
    async function validation(earliestLedgerVersion, maxLedgerVersion, txID, api, amount) {
        var x = false 
        var ledgerVersion = null
        api.getLedgerVersion().then(function(d){
            ledgerVersion = parseInt(d)
            console.log('Ledger = @ version ', ledgerVersion)
        })
        console.log(maxLedgerVersion)
        console.log(earliestLedgerVersion)
        x = await logTransaction(earliestLedgerVersion, txID, api, amount)
        if (ledgerVersion > maxLedgerVersion) {
            console.log("If the transaction hasn't succeeded by now, it's expired")
            end("The validation of the transaction took to long", api, amount)
            x = true 
        }
        if(x == false){
            setTimeout(function(){ validation(earliestLedgerVersion,maxLedgerVersion, txID, api, amount); }, 2000);
        }
    }
  
    //function used to check if the transaction has been succesfully put on the ledger. 
    //It can take a couple of ledger updates for this to happen so this function will throw errors.
    //and needs to be called multiple times. 
    async function logTransaction(earliestLedgerVersion,txID, api, amount) {
        try {
            tx = await api.getTransaction(txID, {minLedgerVersion: earliestLedgerVersion})
            console.log("Transaction result:", tx.outcome.result)
            console.log("Balance changes:", JSON.stringify(tx.outcome.balanceChanges) + '\n')
            end(tx.outcome.result, api, amount)  
            return true
        } catch(error) {
            console.log("Couldn't get transaction outcome:", error + '\n')
            return false
        }
    }

    //function used to create the transaction JSON file that needs to be submitted.
    //for a transaction to happen.
    async function doPrepare(amount, senderAddress, receiverAddress, api) {
        const sender = senderAddress
        const preparedTx = await api.prepareTransaction({
        "TransactionType": "Payment",
        "Account": sender,
        "Amount": api.xrpToDrops(amount), // Same as "Amount": "22000000"
        "Destination": receiverAddress
        }, {
        // Expire this transaction if it doesn't execute within ~5 minutes:
        "maxLedgerVersionOffset": 75
        })
        maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
        minLedgerVersion = preparedTx.instructions.minLedgerVersion
        console.log("Prepared transaction instructions:", preparedTx.txJSON + '\n')
        console.log("Transaction cost:", preparedTx.instructions.fee, "XRP")
        console.log("Transaction expires after ledger:", maxLedgerVersion + '\n')
        return [preparedTx.txJSON, maxLedgerVersion];
    }

    //the function used to submit the transaction to the ledger.
    async function doSubmit(txBlob, api) {

        const latestLedgerVersion = await api.getLedgerVersion()
    
        const result = await api.submit(txBlob)
        
        //log the tentative results. keep in mind that these are not final.
        //this log could indicate a succesfull transaction that ultimately fails
        //and vice versa.
        console.log("Tentative result code:", result.resultCode)
        console.log("Tentative result message:", result.resultMessage + '\n')
    
        // Return the earliest ledger index this transaction could appear in
        // as a result of this submission, which is the first one after the
        // validated ledger at time of submission.
        return latestLedgerVersion + 1
    }


// Function to get the credentials of the user
async function getCredentials(filename) {
    // Get path were credential is stored
    var path = browser.runtime.getURL("/keys/" + filename);
    const tmpFiles = await IDBFiles.getFileStorage({name: "tmpFiles"});
    const file = await tmpFiles.get(path);
    // Only open if its a mutable file.
    // Check if file exists
    if (typeof file !== 'undefined'){
        if(file.open) {
            const fh = file.open("readonly");
            // Return value
            const value = await fh.readAsText(200);
            return value
        }
    } else {
        return 0
    }
}


// function printXrpConnection() {
//     var api = new ripple.RippleAPI({server:'wss://s1.ripple.com/'});
//     api.connect().then(function() {
//         return api.getServerInfo();
//     }).then(function(server_info) {
//       document.body.innerHTML += "<p>Connected to rippled server!</p>" +
//       "      <table>" +
//       "        <tr><th>Version</th>" +
//       "          <td>" + server_info.buildVersion + "</td></tr>" +
//       "        <tr><th>Ledgers available</th>" +
//       "          <td>" + server_info.completeLedgers + "</td></tr>" +
//       "        <tr><th>hostID</th>" +
//       "          <td>" + server_info.hostID + "</td></tr>" +
//       "        <tr><th>Most Recent Validated Ledger Seq.</th>" +
//       "          <td>" + server_info.validatedLedger.ledgerVersion + "</td></tr>" +
//       "        <tr><th>Most Recent Validated Ledger Hash</th>" +
//       "          <td>" + server_info.validatedLedger.hash + "</td></tr>" +
//       "        <tr><th>Seconds since last ledger validated</th>" +
//       "          <td>" + server_info.validatedLedger.age + "</td></tr>" +
//       "      </table>";
//       });
//   }
