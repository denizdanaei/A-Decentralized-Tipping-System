function doTransaction(receiverAddress, senderAddress, privateKey, amount) {
    console.log("Public address webpage " + receiverAddress)
    console.log("Public address user " + senderAddress)
    console.log("Private key user " + privateKey)
    console.log("tip amount " + amount)

    // For testing overwrite the arguments
    receiverAddress = 'raoeq8pivVwaJoA7medQrBFt6nb5SMLt18'
    senderAddress = 'rPipQJrNtByNFuybUJNQnPGqGfzvKsxx2e'
    privateKey = 'shtpSCSbCFfvyAZLuo7aYutvkkKeu'
   
    api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
    var maxLedgerVersion = null
    var txID = null

    //this is pretty much the main function for the transaction. 
    //the first step is to connect to the API server
    api.connect().then(() => {
        console.log('Connected to the API server' + '\n');
        
        //The second step is to check if the user has enough balance on their account
        //to make the tip.
        checkBalance(senderAddress, amount).then(array => {
            if (array[0] == true) {
                amount = array[1]

                //The third step is to create the JSON file used for the transaction
                doPrepare().then(txJSON => {  
        
                //The fourth step is to sign the JSON file with the secret key
                const response = api.sign(txJSON, privateKey)
                txID = response.id
                console.log("Identifying hash:", txID)
                const txBlob = response.signedTransaction
                console.log("Signed blob:", txBlob + '\n')
        
                //The fifth step is to take the signed Blob and submit it too the ledger
                doSubmit(txBlob).then(earliestLedgerVersion => {
        
                //The transaction has been submitted. this method checks on each ledger update if the transaction.
                //has been accepted. if it has the success is logged and the process is ended    
                validation(earliestLedgerVersion, maxLedgerVersion)
        
                }).catch(console.error)

                }).catch(console.error);
            } else {
                //If the user does not have enough balance inform them and exit the function without performing the transaction.
                document.getElementById('ValidationText').innerHTML = "Sorry but the transaction was cancelled. <br> Your balance wasn't high enough." +
                                                                       "<br> You can try again if you want.";
                end()
            }    

        }).catch(console.error);

        }).catch(console.error); 
   
    // function used to disconnect from the server and end the process
    function end() {
        api.disconnect().then(() => {
            console.log('API has disconnected');
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
    async function checkBalance(senderAddress, amount) {
        // Account info is called because it contains the users balance.
        info = await api.getAccountInfo(senderAddress)
        
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
    async function validation(earliestLedgerVersion, maxLedgerVersion) {
        var x = false 
        var ledgerVersion = null
        api.getLedgerVersion().then(function(d){
            ledgerVersion = parseInt(d)
            console.log('Ledger = @ version ', ledgerVersion)
        })
        x = await logTransaction(earliestLedgerVersion)
        if (ledgerVersion > maxLedgerVersion) {
            console.log("If the transaction hasn't succeeded by now, it's expired")
            end()
            x = true 
        }
        if(x == false){
            setTimeout(function(){ validation(earliestLedgerVersion,maxLedgerVersion); }, 2000);
        }
    }
  
    //function used to check if the transaction has been succesfully put on the ledger. 
    //It can take a couple of ledger updates for this to happen so this function will throw errors.
    //and needs to be called multiple times. 
    async function logTransaction(earliestLedgerVersion) {
        try {
            tx = await api.getTransaction(txID, {minLedgerVersion: earliestLedgerVersion})
            console.log("Transaction result:", tx.outcome.result)
            console.log("Balance changes:", JSON.stringify(tx.outcome.balanceChanges) + '\n')
            end()  
            return true
        } catch(error) {
            console.log("Couldn't get transaction outcome:", error + '\n')
            return false
        }
    }

    //function used to create the transaction JSON file that needs to be submitted.
    //for a transaction to happen.
    async function doPrepare() {
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
        return preparedTx.txJSON
    }

    //the function used to submit the transaction to the ledger.
    async function doSubmit(txBlob) {

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
}
 
function printXrpConnection(userData) {
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
      "<tr><th>Sender address + private key</th>" +
      "          <td>" + userData['publicAddress'] + " " + userData['privateKey'] + "</td></tr>" +
      "      </table>";
      });
  }
