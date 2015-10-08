var expect = require('chai').expect;
var sinon = require('sinon');

var contextGetVariableMethod,
	httpClientSendMethod,
	requestConstr;

beforeEach(function() {
	GLOBAL.context = {
		getVariable: function(s) {}
	};

	GLOBAL.httpClient = {
		send: function(s) {}
	};

	GLOBAL.Request = function(s) {};
	
	console.log('beforeEach1');
	contextGetVariableMethod = sinon.stub(GLOBAL.context, 'getVariable');
	httpClientSendMethod = sinon.stub(httpClient, 'send');
	requestConstr = sinon.spy(GLOBAL, 'Request');
});

afterEach(function() {
	console.log('afterEach1');
	contextGetVariableMethod.restore();
	httpClientSendMethod.restore();
	requestConstr.restore();
});

exports.get = function() {
	return {
		contextGetVariableMethod: contextGetVariableMethod,
		httpClientSendMethod: httpClientSendMethod,
		requestConstr: requestConstr
	};
};