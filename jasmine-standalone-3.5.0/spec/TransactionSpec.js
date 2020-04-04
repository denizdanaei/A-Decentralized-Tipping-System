describe("Transaction Tests", function() {
	beforeEach(function() {
		// Spy on checking the users credentials
        spyOn(window, 'getCredentials').and.returnValue('testdata');
        doTransaction('r9arMLuj7JbqhppNAMxdJkYuJ3GBmheqqf', 10)
		// Get credentials promise
	})

    it("doTransaction", function() {
        expect(window.getCredentials).toHaveBeenCalledWith("publicAddress.txt");
	});		
});