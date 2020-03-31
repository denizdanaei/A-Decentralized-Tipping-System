describe("Tipping Tests", function() {

  // beforeEach(function(){
  //   browser().navigateTo('/');
  // });

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
describe('exchangeRate', function() {
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
    exchangeRatePromise = exchangeRate(100, 'https://www.bitstamp.net/api/v2/ticker/xrpeur/', "EUR ")
    // temperaturePromise2 = exchangeRate(1.0, 'https://www.bitstamp.net/api/v2/ticker/xrpusd/' , 'USD ')
    ;
	});

	it('fetches from the weather API', async function() {
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
