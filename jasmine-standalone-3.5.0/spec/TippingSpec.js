

describe("Tipping getAddress", function() {
	
	beforeEach(function () {
		document.body.innerHTML = '';
	});

	it("Get public address webpage - filled", function() {
		// Create fake address and add to document
		var meta = document.createElement('meta');
		meta.name = "Tudelft-tipping-extension";
		meta.content = "r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf";
		document.getElementsByTagName('head')[0].appendChild(meta);
		expect(getPublicAddressWebpage()).toEqual('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf');
	});	
});
describe('exchangeRate EUR', function() {
	var exchangeRatePromise;
	var promiseHelper;

	beforeEach(function() {
		var fetchPromise = new Promise(function(resolve, reject) {
			promiseHelper = {
				resolve: resolve,
				reject: reject
			};
		});
		spyOn(window, 'fetch').and.returnValue(fetchPromise);
	
		// Get exchange rate
	exchangeRatePromise = exchangeRate(100, 'https://www.bitstamp.net/api/v2/ticker/xrpeur/', "EUR ") ;
	});

	it('fetches from the Bistamp', async function() {
		expect(window.fetch).toHaveBeenCalledWith('https://www.bitstamp.net/api/v2/ticker/xrpeur/');
	});

	it('returns a promise', function() {
		expect(exchangeRatePromise).toEqual(jasmine.any(Promise));
	});

	describe('on successful fetch', function() {
		beforeEach(function() {
			var response = new Response(JSON.stringify({
				last: 1
			}));
			promiseHelper.resolve(response);
		});
    var res = 100.000
		it('resolves its promise with the current temperature', function(done) {
			exchangeRatePromise.then(function(temperature) {
				expect(temperature).toEqual(res.toFixed(2));
				done();
			});
		});
	});

	describe('on unsuccessful fetch', function() {
		var errorObj = { msg: 'Wow, this really failed!' };

		beforeEach(function() {
			promiseHelper.reject(errorObj);
		});

		it('resolves its promise with the current temperature', function(done) {
			exchangeRatePromise.catch(function(error) {
				expect(error).toEqual(errorObj);
				done();
			});
		});
	});
});

describe('showCorrectDiv Empty - ', function() {
	var publicPromise;
	var promiseHelper;

	var originalTimeout;


	beforeEach(function() {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
		
		// Spy on checking the users credentials
		spyOn(window, 'getCredentials').and.returnValue(0);	
		showCorrectDiv()

		spyOn(window, 'showUploadDiv').and.callThrough();
		// Get credentials promise
	})

	it('Get public file', async function() {
        expect(window.getCredentials).toHaveBeenCalledWith("publicAddress.txt");
	});
});

describe('showCorrectDiv Filled - ', function() {
	beforeEach(function() {
		// Spy on checking the users credentials
		spyOn(window, 'getCredentials').and.returnValue('testdata');	
		spyOn(window, 'showTipDiv');
		showCorrectDiv()
	})
	it('Get public empty file', async function() {
		expect(window.getCredentials).toHaveBeenCalledWith("publicAddress.txt");
	});	
});

describe('showTipDiv Filled ', function() {
	beforeEach(function() {
		// Spy on checking the users credentials
		document.body.innerHTML += '<p id="ValidationTextUpload", style="color:red">'
		var spyObj = spyOn(window, 'getCredentials').and.returnValue(0);
		showTipDiv()
		// Get credentials promise
	})

	it('Get public empty file', async function() {
		expect(window.getCredentials).toHaveBeenCalledTimes(1);
	});
});


// describe('readall ', function() {
// 	beforeEach(function() {
// 		// Spy on checking the users credentials
//         document.body.innerHTML += '<p id="ValidationTextUpload", style="color:red">'
//         spyOn(document, 'getElementById').and.returnValue(6)
// 		//var spyObj = spyOn(window, 'getCredentials').and.returnValue(0);
// 		//showTipDiv()
// 		// Get credentials promise
// 	})

// 	it('readall', async function() {
//         expect(document.getElementById('ValidationTextUpload').innerHTML).toEqual("Please upload")
//         //expect(window.getCredentials).toHaveBeenCalledTimes(1);
// 	});
// });

describe('Donate Money - ', function() {
	beforeEach(function() {
		// Spy on checking the users credentials
		spyOn(window, 'doTransaction').and.returnValue(100);	
		spyOn(window, 'exchangeRate').and.returnValue(120)
	})

	it('Donate money - Failed empty donation', async function() {
		var dummyElement = document.createElement('button');
		document.getElementById = jasmine.createSpy('TwitterButton').and.returnValue(dummyElement);

		spyOn(window, 'alert');
		donateMoney()
		expect(window.alert).toHaveBeenCalledWith('Please insert a valid number.');
	});
});


//  Want to test the case where a valid number if filled in but for some reason i am not able to mock the "var e = document.getElementById("ddlViewBy");" in the else case of donateMoney

describe('Donate Money - EUR ', function() {

	beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
		document.body.innerHTML = '';	  
		// Spy on checking the users credentials
		spyOn(window, 'doTransaction').and.returnValue(100);	
		spyOn(window, 'exchangeRate').and.returnValue(120);
        spyOn(window, 'confirm').and.returnValue(true);
		//spyOn(window, 'printXrpConnection').and.returnValue("test");

		// Set HTML needed for testing
		var meta = document.createElement('meta');
		meta.name = "Tudelft-tipping-extension";
		meta.content = "r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf";
		document.getElementsByTagName('head')[0].appendChild(meta);
		document.body.innerHTML += '<p id="ValidationText", style="color:red"></p>'
		document.body.innerHTML += '<button id = "TwitterButton" style="display:none">'
		document.body.innerHTML += '<input type = "number" id = "amount" name = "number" value = "12">';
		document.body.innerHTML += '<select id = "ddlViewBy"><option selected value="EUR">EUR</option></select>';
		document.body.innerHTML += '<button id = "donateButton" disabled>';
	})

	it('Donate money - Correct inserted EUR confirm test', async function() {
		// First try		
        await donateMoney()
        //await sleep(29000)

        expect(window.exchangeRate).toHaveBeenCalledWith('12', 'https://www.bitstamp.net/api/v2/ticker/xrpeur/', 'EUR ');
        expect(window.doTransaction).toHaveBeenCalled();
        
        //var confirmation = "Please confirm that you want to tip 12 EUR?" + " This will be done by tipping 120 in XRP." + "\n \nThe tip will be send to: " + "r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf"
		//expect(window.confirm).toHaveBeenCalledWith(confirmation);
    });
    
    // afterEach(function(done) {
	// 	expect(window.exchangeRate).toHaveBeenCalledWith('12', 'https://www.bitstamp.net/api/v2/ticker/xrpeur/', 'EUR ');
    //     expect(window.doTransaction).toHaveBeenCalled();
	// 	done();
  	// });
});

describe('Donate Money - USD ', function() {
	beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
		document.body.innerHTML = '';
		// Spy on checking the users credentials
		spyOn(window, 'doTransaction').and.returnValue(100);	
		spyOn(window, 'exchangeRate').and.returnValue(120);
		spyOn(window, 'confirm').and.returnValue(true);
		//spyOn(window, 'printXrpConnection').and.returnValue("test");

		// Set HTML needed for testing
		var meta = document.createElement('meta');
		meta.name = "Tudelft-tipping-extension";
		meta.content = "r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf";
		document.getElementsByTagName('head')[0].appendChild(meta);
		document.body.innerHTML += '<p id="ValidationText", style="color:red"></p>'
		document.body.innerHTML += '<button id = "TwitterButton" style="display:none">'
		document.body.innerHTML += '<input type = "number" id = "amount" name = "number" value = "12">';
		document.body.innerHTML += '<select id = "ddlViewBy"><option selected value="USD">USD</option></select>';
		document.body.innerHTML += '<button id = "donateButton" disabled>';
	})

	it('Donate money - Correct inserted USD confirm test', async function() {
		// First try		
        await donateMoney()
        //await sleep(29000)

        expect(window.exchangeRate).toHaveBeenCalledWith('12', 'https://www.bitstamp.net/api/v2/ticker/xrpusd/', 'USD ');
        expect(window.doTransaction).toHaveBeenCalled();

        //var confirmation = "Please confirm that you want to tip 12 USD?" + " This will be done by tipping 120 in XRP." + "\n \nThe tip will be send to: " + "r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf"
		//expect(window.confirm).toHaveBeenCalledWith(confirmation);
	});
});

describe('Donate Money - XRP ', function() {
	beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
		document.body.innerHTML = '';	
		// Spy on checking the users credentials
		spyOn(window, 'doTransaction').and.returnValue(100);	
		spyOn(window, 'exchangeRate').and.returnValue(120);
		spyOn(window, 'confirm').and.returnValue(true);
		//spyOn(window, 'printXrpConnection').and.returnValue("test");

		// Set HTML needed for testing
		var meta = document.createElement('meta');
		meta.name = "Tudelft-tipping-extension";
		meta.content = "r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf";
		document.getElementsByTagName('head')[0].appendChild(meta);
		document.body.innerHTML += '<p id="ValidationText", style="color:red"></p>'
		document.body.innerHTML += '<button id = "TwitterButton" style="display:none">'
		document.body.innerHTML += '<input type = "number" id = "amount" name = "number" value = "12">';
		document.body.innerHTML += '<select id = "ddlViewBy"><option selected value="XRP">XRP</option></select>';
		document.body.innerHTML += '<button id = "donateButton" disabled>';
	})

	it('Donate money - Correct inserted XRP test', async function() {
		// First try		
        await donateMoney()
        //await sleep(29000)
        
        expect(window.exchangeRate).not.toHaveBeenCalled();
        expect(window.doTransaction).toHaveBeenCalled();

        //var confirmation = "Please confirm that you want to tip 12 XRP?" + "\n \nThe tip will be send to: " + "r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf"
		//expect(window.confirm).toHaveBeenCalledWith(confirmation);
	});
});
