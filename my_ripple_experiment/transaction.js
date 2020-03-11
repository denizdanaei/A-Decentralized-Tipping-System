
function doTransaction(receiverAddress, senderAddress, privateKey) {
    console.log("Public address webpage " + receiverAddress)
    console.log("Public address user " + senderAddress)
    console.log("Private key user " + privateKey)

    // For testing overwrite the arguments
    receiverAddress = 'rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM'
    senderAddress = 'rB76Ts8bXWnZVkqbFULYpwV9CaUaCFZ6hn'
    privateKey = 'ss7ktBumXYJAF9PhkHmwhEUCD7Ldc'

    api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
    var maxLedgerVersion = null
    var txID = null

    //this is pretty much the main function for the transaction. 
    //the first step is to connect to the API server
    api.connect().then(() => {
        console.log('Connected to the API server' + '\n');
        
        //The second step is to create the JSON file used for the transaction
        doPrepare().then(txJSON => {  
        
        //The third step is to sign the JSON file with the secret key
        const response = api.sign(txJSON, privateKey)
        txID = response.id
        console.log("Identifying hash:", txID)
        const txBlob = response.signedTransaction
        console.log("Signed blob:", txBlob + '\n')
        
        //The fourth step is to take the signed Blob and submit it too the ledger
        doSubmit(txBlob).then(earliestLedgerVersion => {
        
        //The transaction has been submitted. this method checks on each ledger update if the transaction.
        //has been accepted. if it has the success is logged and the process is ended    
        api.on('ledger', ledger => {
            console.log("Ledger version", ledger.ledgerVersion, "was just validated." + '\n')
            logTransaction(earliestLedgerVersion)
        
            if (ledger.ledgerVersion > maxLedgerVersion) {
                //after a certain amount of ledger updates with still no transaction information available
                //is considered to be expired. this is logged and the process is ended.
                console.log("If the transaction hasn't succeeded by now, it's expired")
                end()
    
            }
        })

        }).catch(console.error)

        }).catch(console.error);

    }).catch(console.error);
   
    //function used to disconnect from the server and end the process
    function end() {
        api.disconnect().then(() => {
            console.log('API has disconnected');
            return false;
        })
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
        } catch(error) {
            console.log("Couldn't get transaction outcome:", error + '\n')
        }
    }

    //function used to create the transaction JSON file that needs to be submitted.
    //for a transaction to happen.
    async function doPrepare() {
        const sender = senderAddress
        const preparedTx = await api.prepareTransaction({
        "TransactionType": "Payment",
        "Account": sender,
        "Amount": api.xrpToDrops("0.01"), // Same as "Amount": "22000000"
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

