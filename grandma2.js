var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var TelnetSocket = require("telnet-stream").TelnetSocket;
var debug;
var log;


function instance(system, id, config) {
	var self = this;

	// Request id counter
	self.request_id = 0;
	self.login = false;
	// super-constructor
	instance_skel.apply(this, arguments);
	self.status(1,'Initializing');
	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;
	self.init_tcp();
};

instance.prototype.incomingData = function(data) {
	var self = this;
	debug(data);

	if (self.login === false && data.match(/Please login/)) {
		self.status(1,'Logging in');
		self.telnet.write("login "+self.config.user+" "+self.config.pass+"\r\n");
	}
	else if (self.login === false && data.match(/Logged in as User/) && !data.match(/guest/)) {
		self.login = true;
		self.status(0);
		debug("logged in");
	}
	else if (self.login === false && data.match(/no login/)) {
		debug("incorrect username/password");
		self.status(2,'Incorrect user/pass');

	}
	else {
		debug("data nologin", data);
	}
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.init_tcp();
};

instance.prototype.init_tcp = function() {
	var self = this;
	var receivebuffer = '';

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
		self.login = false;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, 30000);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			debug("Connected");
			self.login = false;
		});

		self.telnet = new TelnetSocket(self.socket.socket);

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.log('error',"Network error: " + err.message);
		});

		// if we get any data, display it to stdout
		self.telnet.on("data", function(buffer) {
			var indata = buffer.toString("utf8");
			self.incomingData(indata);
		});

		// tell remote we WONT do anything we're asked to DO
		self.telnet.on("do", function(option) {
			return self.telnet.writeWont(option);
		});

		// tell the remote DONT do whatever they WILL offer
		self.telnet.on("will", function(option) {
			return self.telnet.writeDont(option);
		});

	}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'Remember to activate Telnet Remote in Setup -> Console -> Global Settings -> Telnet'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'grandMA2 Console IP',
			width: 12,
			default: '192.168.0.1',
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'user',
			label: 'Username',
			width: 6,
			default: 'administrator',
		},
		{
			type: 'textinput',
			id: 'pass',
			label: 'Password',
			width: 6,
			default: 'admin'
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};

instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {

		'command': {
			label:'Run Command',
			options: [
				{
					 type: 'textinput',
					 label: 'Command',
					 id: 'command',
					 default: '',
				}
			]
		}


	});
}

instance.prototype.action = function(action) {
	var self = this;
	console.log("Sending some action", action);
	var cmd;
	if (action.action === 'command') {
		cmd = action.options.command;
	}

	if (cmd !== undefined) {

		if (self.socket !== undefined && self.socket.connected) {
			self.telnet.write(cmd+"\r\n");
		} else {
			debug('Socket not connected :(');
		}

	}
};

instance.module_info = {
	label: 'grandMA2',
	id: 'grandma2',
	version: '0.0.1'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
