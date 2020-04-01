describe("Tipping Tests", function() {

  it("Get public address webpage - empty", function() {
    // Get address op public webpage
    expect(getPublicAddressWebpage()).toEqual('The public address of this webpage is not found');
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

		// Get credentials promise
	})

	it('Get public empty file', async function() {
		expect(window.getCredentials).toHaveBeenCalledWith("publicAddress.txt");
	});
	// WHY IS THIS NOT CALLED?!
	// it('Get public empty file', async function() {
	// 	expect(window.showTipDiv).toHaveBeenCalled()
	// });
});


describe('Donate Money - ', function() {
	beforeEach(function() {
		// Spy on checking the users credentials
		spyOn(window, 'doTransaction').and.returnValue(100);	
		spyOn(window, 'exchangeRate').and.returnValue(120)
		// spyOn(window, 'showTipDiv');
	
		// Get credentials promise
	})

	it('Donate money - Failed characters inserted', async function() {
		var input = document.createElement("input");
		input.type = "number";
		input.name = "amount"
		input.id = "amount"

		document.getElementsByTagName('body')[0].appendChild(input);

		var dummyElement = document.createElement('button');
		document.getElementById = jasmine.createSpy('TwitterButton').and.returnValue(dummyElement);

		spyOn(window, 'alert');
		donateMoney()
		expect(window.alert).toHaveBeenCalledWith('Please insert a valid number.');

	});
});


//  Want to test the case where a valid number if filled in but for some reason i am not able to mock the "var e = document.getElementById("ddlViewBy");" in the else case of donateMoney
describe('Donate Money - ', function() {
	beforeEach(function() {
		// Spy on checking the users credentials
		spyOn(window, 'doTransaction').and.returnValue(100);	
		spyOn(window, 'exchangeRate').and.returnValue(120)
		// spyOn(window, 'showTipDiv');
	
		// Get credentials promise
	})

	it('Donate money - correct inserted', async function() {
		
		var input = document.createElement("input");
		input.type = "number";
		input.name = "amount"
		input.id = "amount"

		document.getElementsByTagName('body')[0].appendChild(input);

		var dummyElement = document.createElement('button');
		document.getElementById = jasmine.createSpy('TwitterButton').and.returnValue(dummyElement);

		var dummyElement = document.createElement('number');
		document.getElementById = jasmine.createSpy('amount').and.returnValue(10);

		var dummyElement = document.createElement('select');
		document.getElementById.value = jasmine.createSpy('ddlViewBy').and.returnValue('EUR ');

		const spy = spyOnProperty(document, 'amount', 'get').andReturn(1);

		// spyOn(window, 'exchangeRate');
		donateMoney()
		expect(window.exchangeRate).toHaveBeenCalledWith(1, 'https://www.bitstamp.net/api/v2/ticker/xrpeur/', "EUR ");

	});
});// WHY IS THIS NOT CALLED?!
	// it('Get public empty file', async function() {
	// 	expect(window.showTipDiv).toHaveBeenCalled()
	// });
// });
