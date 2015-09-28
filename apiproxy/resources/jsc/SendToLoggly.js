try {
	var log = {
		messageId: context.getVariable('messageid'),
		organization: context.getVariable('organization.name'),
		environment: context.getVariable('environment.name'),
		responseCode: context.getVariable('response.status.code'),
		clientIp: context.getVariable('proxy.client.ip'),
		error: context.getVariable('oauthv2.GenerateAccessToken.fault_cause')
	};

	// if (log.environment === 'dev') {
	// 	log.response = context.getVariable('response.content');
	// } else {
	// 	log.response = 'N/A';
	// }

	var url = 'http://logs-01.loggly.com/inputs/f32d42c7-8be7-40e1-bd27-d3d86a6caae8/tag/http/';

	var header = {
		'Content-Type': 'application/json'
	};

	httpClient.send(new Request(url, 'POST', header, JSON.stringify(log)));
} catch (e) {}