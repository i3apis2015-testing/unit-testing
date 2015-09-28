var expect = require('chai').expect;
var sinon = require('sinon');

var js = '../../apiproxy/resources/jsc/SendToLoggly.js';

GLOBAL.context = {
	getVariable: function(s) {}
};

GLOBAL.httpClient = {
	send: function(s) {}
};

GLOBAL.Request = function(s) {};

var contextGetVariableMethod,
	httpClientSendMethod,
	requestConstr;

beforeEach(function() {
	contextGetVariableMethod = sinon.stub(context, 'getVariable');
	httpClientSendMethod = sinon.stub(httpClient, 'send');
	requestConstr = sinon.spy(GLOBAL, 'Request');
});

afterEach(function() {
	contextGetVariableMethod.restore();
	httpClientSendMethod.restore();
	requestConstr.restore();
});

describe('feature: logging to loggly', function() {
	it('should push error logs correctly to loggly', function() {
		contextGetVariableMethod.withArgs('organization.name').returns('org1');
		contextGetVariableMethod.withArgs('environment.name').returns('dev');
		contextGetVariableMethod.withArgs('messageid').returns('1234');
		contextGetVariableMethod.withArgs('response.status.code').returns('400');
		contextGetVariableMethod.withArgs('proxy.client.ip').returns('10.10.10.10');
		contextGetVariableMethod.withArgs('oauthv2.GenerateAccessToken.fault_cause').returns('boo');

		var errorCaught = false;
		try{
			execute(js);
		} catch (e) {
			console.log(e);
			errorCaught = true;
		}

		expect(errorCaught).to.be.false;

		expect(httpClientSendMethod.calledOnce).to.be.true;
		expect(requestConstr.calledOnce).to.be.true;

		var requestConstrArguments = requestConstr.args[0];
		expect(requestConstrArguments[0]).to.equal('http://logs-01.loggly.com/inputs/f32d42c7-8be7-40e1-bd27-d3d86a6caae8/tag/http/');
		expect(requestConstrArguments[1]).to.equal('POST');
		expect(requestConstrArguments[2]['Content-Type']).to.equal('application/json');

		var logObject = JSON.parse(requestConstrArguments[3]);
		expect(logObject.messageId).to.equal('1234');
		expect(logObject.organization).to.equal('org1');
		expect(logObject.environment).to.equal('dev');
	});
});

function execute(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}



