function initClient(done) {
	console.log("Init AgoraRTC client with App ID: " + appId);
	client = AgoraRTC.createClient({
		mode: 'interop'
	});
	client.init(appId, function () {
		console.log("AgoraRTC client initialized");
		client.join(channel_key, channel_value, null, function (uid) {
			console.log("User " + uid + " join channel successfully");
			done(client, uid);
		});
	}, function (err) {
		console.log("AgoraRTC client init failed", err);
	});

	client.on('error', function (err) {
		console.log("Got error msg:", err.reason);
		if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
			client.renewChannelKey(channelKey, function () {
				console.log("Renew channel key successfully");
			}, function (err) {
				console.log("Renew channel key failed: ", err);
			});
		}
	});

}


function init() {
	getLocalStreams(function (localStreams) {
		initClient(function (client, uid) {
			console.log("Publishing all streams");
			publishAllStreams(client, localStreams);
		});
	});
}

init();