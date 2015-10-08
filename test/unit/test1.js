var expect = require('chai').expect;
var sinon = require('sinon');
var hooks = require('./hooks.js');

var js = '../../apiproxy/resources/jsc/SendToLoggly.js';

describe('feature: logging to loggly2', function() {
	it('should push error logs correctly to loggly', function(done) {
		var o = hooks.get();
		
		o.contextGetVariableMethod.withArgs('organization.name').returns('org1');
		o.contextGetVariableMethod.withArgs('messageid').returns('1234');

		var errorCaught = false;
		try{
			execute(js);
		} catch (e) {
			console.log(e);
			errorCaught = true;
		}

		expect(errorCaught).to.be.false;
		expect(o.httpClientSendMethod.calledOnce).to.be.true;

		var requestConstrArguments = o.requestConstr.args[0];
		expect(requestConstrArguments[0]).to.equal('http://logs-01.loggly.com/inputs/f32d42c7-8be7-40e1-bd27-d3d86a6caae8/tag/http/');
		expect(requestConstrArguments[1]).to.equal('POST');
		expect(requestConstrArguments[2]['Content-Type']).to.equal('application/json');

		var logObject = JSON.parse(requestConstrArguments[3]);
		expect(logObject.messageId).to.equal('1234');
		expect(logObject.organization).to.equal('org1');

		done();
	});
});

function execute(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}

