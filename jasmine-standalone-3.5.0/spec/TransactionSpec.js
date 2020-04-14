// Test for when the api created is unable to connect to the ripple server.
describe("do Transaction no connection to API", function() {
	beforeEach(function() {
		spyOn(window, 'getCredentials').and.returnValue('testdata');
		api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
		spyOn(window, 'API').and.returnValue(api);

		spyOn(api, 'connect').and.returnValue(Promise.reject());

		spyOn(window, 'checkBalance')
		spyOn(window, 'end')
	})

	afterEach(function(done) {
		expect(window.checkBalance).not.toHaveBeenCalled();
		expect(window.end).not.toHaveBeenCalled();
		expect(window.getCredentials).toHaveBeenCalledWith("publicAddress.txt");
		done();
  	});

	it("doTransaction no connection to API", async function() {
		await doTransaction('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf', 10)
	});

});

// Test for when the user does not have enough balance to perform the transaction.
describe("do Transaction not enough balance.", function() {
	beforeEach(function() {
		spyOn(window, 'getCredentials').and.returnValue('testdata');
		api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
		spyOn(window, 'API').and.returnValue(api);

		spyOn(api, 'connect').and.returnValue(Promise.resolve());
		
		array = [false, 10]

		spyOn(window, 'checkBalance').and.returnValue(Promise.resolve(array))
		spyOn(window, 'end')
	})

	afterEach(function(done) {
		expect(window.checkBalance).toHaveBeenCalled();
		expect(window.end).toHaveBeenCalled();
		expect(window.getCredentials).toHaveBeenCalledWith("publicAddress.txt");
		done();
  	});

	it("doTransaction not enough balance", async function() {
		await doTransaction('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf', 10)
	});

});

// Test for when the promise object returned by doPrepare rejects. 
describe("do Transaction doPrepare promise rejects", function() {
	beforeEach(function() {
		spyOn(window, 'getCredentials').and.returnValue('testdata');
		api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
		spyOn(window, 'API').and.returnValue(api);

		spyOn(api, 'connect').and.returnValue(Promise.resolve());
		
		array = [true, 10]

		spyOn(window, 'checkBalance').and.returnValue(Promise.resolve(array))
		spyOn(window, 'doPrepare').and.returnValue(Promise.reject({ message: 'failure' }))
		spyOn(window, 'end')
	})

	afterEach(function(done) {
		expect(window.checkBalance).toHaveBeenCalled();
		expect(window.end).not.toHaveBeenCalled();
		expect(window.getCredentials).toHaveBeenCalledWith("publicAddress.txt");
		expect(window.doPrepare).toHaveBeenCalled();
		done();
  	});

	it("doTransaction doPrepare promise rejects", async function() {
		await doTransaction('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf', 10)
	});

});

// Test for when the promise object returned by doSubmit rejects. 
describe("do Transaction doSubmit promise rejects", function() {
	beforeEach(function() {
		spyOn(window, 'getCredentials').and.returnValue('testdata');
		api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
		spyOn(window, 'API').and.returnValue(api);

		spyOn(api, 'connect').and.returnValue(Promise.resolve());
		
		array = [true, 10]

		spyOn(window, 'checkBalance').and.returnValue(Promise.resolve(array))

		array2 = ['testsign', 'testvalue']

		spyOn(window, 'doPrepare').and.returnValue(Promise.resolve(array2))
		spyOn(window, 'end')

		ret = {
		   id: "testID",
		   signedTransaction: "testBlob"      
		};

		spyOn(api, 'sign').and.returnValue(ret)
		spyOn(window, 'validation')
		spyOn(window, 'doSubmit').and.returnValue(Promise.reject({ message: 'failure' }))
	})

	afterEach(function(done) {
		expect(window.checkBalance).toHaveBeenCalled();
		expect(window.end).not.toHaveBeenCalled();
		expect(window.getCredentials).toHaveBeenCalledWith("publicAddress.txt");
		expect(window.doPrepare).toHaveBeenCalled();
		expect(window.doSubmit).toHaveBeenCalled();
		expect(window.validation).not.toHaveBeenCalled();
		done();
  	});

	it("doTransaction doPrepare promise rejects", async function() {
		await doTransaction('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf', 10)
		await sleep(200)
	});

});

// Test for doTransaction for when the user does a succesful transaction.
describe("do Transaction successful transaction", function() {
	beforeEach(function() {
		spyOn(window, 'getCredentials').and.returnValue('testdata');
		api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
		spyOn(window, 'API').and.returnValue(api);

		spyOn(api, 'connect').and.returnValue(Promise.resolve());
		
		array = [true, 10]

		spyOn(window, 'checkBalance').and.returnValue(Promise.resolve(array))

		array2 = ['testsign', 'testvalue']

		spyOn(window, 'doPrepare').and.returnValue(Promise.resolve(array2))
		spyOn(window, 'end')

		ret = {
		   id: "testID",
		   signedTransaction: "testBlob"      
		};

		spyOn(api, 'sign').and.returnValue(ret)
		spyOn(window, 'validation')
		spyOn(window, 'doSubmit').and.returnValue(Promise.resolve())
	})

	afterEach(function(done) {
		expect(window.checkBalance).toHaveBeenCalled();
		expect(window.end).not.toHaveBeenCalled();
		expect(window.getCredentials).toHaveBeenCalledWith("publicAddress.txt");
		expect(window.doPrepare).toHaveBeenCalled();
		expect(window.doSubmit).toHaveBeenCalled();
		expect(window.validation).toHaveBeenCalled();
		done();
  	});

	it("doTransaction successful transaction", async function() {
		await doTransaction('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf', 10)
		await sleep(200)
	});

});

// Tests for checkBalance() method one for when the user does have enough balance and one for when the 
// user does not have enough balance.
describe("Check balance", function() {
	beforeEach(function() {
		api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
		ret = {
			"xrpBalance": "200",
		  };
        spyOn(api, 'getAccountInfo').and.returnValue(ret);	
	})

    it("user has enough balance", async function() {
		array = await checkBalance('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf', 10, api)
		expect(api.getAccountInfo).toHaveBeenCalledWith('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf');
		expect(array[0]).toEqual(true)
		expect(array[1]).toEqual(10)
	});
	
	it("user does not have enough balance", async function() {
		spyOn(window, 'sleep').and.returnValue(null);
		array = await checkBalance('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf', 3000, api)
		expect(api.getAccountInfo).toHaveBeenCalledWith('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf');
		expect(window.sleep).toHaveBeenCalledWith(2000);
		expect(array[0]).toEqual(false)
		expect(array[1]).toEqual(3000)
	});
	
});

// Test doSubmit method.
describe("do Submit", function() {
	beforeEach(function() {
 		api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
		spyOn(api, 'getLedgerVersion').and.returnValue(5)
		ret = {
		   resultCode: "tesSUCCESS",
		   resultMessage: "this is a stubbed message."      
		};
		spyOn(api, 'submit').and.returnValue(ret)	
	})

    it("submit the transaction blob", async function() {
		blob = "test blob"
		latestLedgerVersion = await doSubmit(blob, api);
		expect(latestLedgerVersion).toEqual(6)
	});
	
});

// Test doPrepare method.
describe("do prepare", function() {
	beforeEach(function() {
 		api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
		spyOn(api, 'xrpToDrops').and.returnValue(50000)
		ret = {
			"instructions": {
				"maxLedgerVersion": 5000,
				"minLedgerVersion": 1,
				"fee": 0.00012,
				},
			"txJSON": "txjson"	     
		};
		spyOn(api, 'prepareTransaction').and.returnValue(ret)	
	})

    it("submit the transaction blob", async function() {
		array = await doPrepare(2000, "senderAddress", "receiverAddress", api);
		expect(array[0]).toEqual("txjson")
		expect(array[1]).toEqual(5000)
	});
	
});

// Tests for logTransaction function. one for when logTransaction is able to find the transaction ID in the ledger,
// and one for when logTransaction is unable to find the transaction ID in the ledger.
describe("log transaction", function() {
	beforeEach(function() {
 		api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
		ret = {
			"outcome": {
				"result": 5000,
				"balancechanges": 3,
				}	     
		};
		spyOn(window, 'end')	
	})

    it("successful log transaction", async function() {
		spyOn(api, 'getTransaction').and.returnValue(ret)
		Bool = await logTransaction(5, 'txid', api, 400);
		expect(Bool).toEqual(true)
		expect(window.end).toHaveBeenCalledTimes(1)
	});

	it("failed log transaction", async function() {
		spyOn(api, 'getTransaction').and.returnValue(Promise.reject({ message: 'failure' }))
		Bool = await logTransaction(5, 'txid', api, 400);
		expect(Bool).toEqual(false)
		expect(window.end).toHaveBeenCalledTimes(0)
	});

	
});

// Tests for validation method. First test is for a succesful validation. Second test is for when the validation method times out.
// And the third test is for when the validation fails and the method recursively calls itself.
describe("validation", function() {
	beforeEach(function() {
 		api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
		spyOn(api, 'getLedgerVersion').and.returnValue(Promise.resolve("10"))
		spyOn(window, 'end')
		spyOn(window, 'setTimeout')	
	})

    it("successful validation", async function() {
		spyOn(window, 'logTransaction').and.returnValue(true)
		await validation(0, 50, 'txid', api, 400);
		expect(window.end).toHaveBeenCalledTimes(0)
		expect(setTimeout).toHaveBeenCalledTimes(0)
	});

	it("timed out validation", async function() {
		spyOn(window, 'logTransaction').and.returnValue(false)
		await validation(0, 0, 'txid', api, 400);
		expect(window.end).toHaveBeenCalledTimes(1)
		expect(setTimeout).toHaveBeenCalledTimes(0)
	});

	it("validation recursively calls itself", async function() {
		spyOn(window, 'logTransaction').and.returnValue(false)
		await validation(0, 50, 'txid', api, 400);
		expect(window.end).toHaveBeenCalledTimes(0)
		expect(setTimeout).toHaveBeenCalledTimes(1)
	});
	
});

// Test for the sleep method.
describe("sleep", function() {

    it("successful sleep", async function() {
		pr = sleep(50)
		expect(pr).toBeInstanceOf(Promise)
	});
	
});

// Test for the end function. One test for each if else condition in that function.
describe("end", function() {
	
	beforeEach(function() {
	   api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
	   spyOn(api, 'disconnect').and.returnValue(Promise.resolve("10"))
	   
	   // Set HTML needed for testing
	   var meta = document.createElement('meta');
	   meta.name = "Tudelft-tipping-extension";
	   meta.content = "r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf";
	   document.getElementsByTagName('head')[0].appendChild(meta);
	   document.body.innerHTML += '<p id="ValidationText", style="color:blue"></p>'
	   document.body.innerHTML += '<button id = "TwitterButton" style="display:none">'
	   document.body.innerHTML += '<input type = "number" id = "amount" name = "number" value = "12">';
	   document.body.innerHTML += '<select id = "ddlViewBy"><option selected value="EUR">EUR</option></select>';
	   document.body.innerHTML += '<button id = "donateButton" disabled>';
   })
	

    it("successful transaction end", async function() {
		await end("tessSUCCESS", api, 5000)
		expect(document.getElementById('TwitterButton').href).toEqual("https://twitter.com/intent/tweet/?text=" + "I just donated " + "5000" +" XRP to website " + 'http://localhost:9876/context.html' 
		+ " using the DTS plugin. More info about the plugin is available at:"  +   "&amp;url=https://github.com/denizdanaie/A-Decentralized-Tipping-System/")
		expect(document.getElementById('ValidationText').style.color).toEqual("green")
		expect(document.getElementById('ValidationText').innerHTML).toEqual("The transaction was succesfully processed.  <br> You can share your donation on social media.")
		expect(document.getElementById('donateButton').disabled).toEqual(false)
	});
	
	it("transaction higher than balance end", async function() {
		await end("transaction was higher than user balance", api, 5000)
		expect(document.getElementById('ValidationText').style.color).toEqual("red")
		expect(document.getElementById('ValidationText').innerHTML).toEqual("Sorry but the transaction was cancelled. <br> Your balance wasn't high enough." +
		"<br> You can try again if you want.")
		expect(document.getElementById('donateButton').disabled).toEqual(false)
	});

	it("validation timed out end", async function() {
		await end("The validation of the transaction took to long", api, 5000)
		expect(document.getElementById('ValidationText').style.color).toEqual("red")
		expect(document.getElementById('ValidationText').innerHTML).toEqual("Sorry but the transaction was cancelled. <br> The validation process timed out" +
		"<br> You can try again if you want.")
		expect(document.getElementById('donateButton').disabled).toEqual(false)
	});

	it("failed transaction end", async function() {
		await end("FAILEDTRANSACTION", api, 5000)
		expect(document.getElementById('ValidationText').style.color).toEqual("red")
		expect(document.getElementById('ValidationText').innerHTML).toEqual("Unfortunately The transaction was not succesfully processed. error code: " + "FAILEDTRANSACTION" +
		"<br> You can try again if you want.")
		expect(document.getElementById('donateButton').disabled).toEqual(false)
	});
	

});

// Test for the API constructor.
describe("API", function() {

	it("successful API made", function() {
		apiResult = API('wss://s.altnet.rippletest.net:51233')
		expect(apiResult).toBeInstanceOf(ripple.RippleAPI)
	});
	

});
