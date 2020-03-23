var instance_skel = require('../../instance_skel');
var TelnetSocket = require('../../telnet');
var debug;
var log;

instance.prototype.CHOICES_BUTTON = [
	{ id: '3', label: 'Ch Pg +' },
			{ id: '4', label: 'Ch Pg -' },
			{ id: '5', label: 'Fd Pg +' },
			{ id: '6', label: 'Fd Pg -' },
			{ id: '7', label: 'Bt Pg +' },
			{ id: '8', label: 'Bt Pg -' },
			{ id: '9', label: 'Pause Playback' },
			{ id: '10', label: 'Go - Playback' },
			{ id: '11', label: 'Go + Playback' },
			{ id: '12', label: 'X1' },
			{ id: '13', label: 'X2' },
			{ id: '14', label: 'X3' },
			{ id: '15', label: 'X4' },
			{ id: '16', label: 'X5' },
			{ id: '17', label: 'X6' },
			{ id: '18', label: 'X7' },
			{ id: '19', label: 'X8' },
			{ id: '20', label: 'X9' },
			{ id: '21', label: 'X10' },
			{ id: '22', label: 'X11' },
			{ id: '23', label: 'X12' },
			{ id: '24', label: 'X13' },
			{ id: '25', label: 'X14' },
			{ id: '26', label: 'X15' },
			{ id: '27', label: 'X16' },
			{ id: '28', label: 'X17' },
			{ id: '29', label: 'X18' },
			{ id: '30', label: 'X19' },
			{ id: '31', label: 'X20' },
			{ id: '32', label: 'List' },
			{ id: '33', label: 'User 1' },
			{ id: '34', label: 'User 2' },
			{ id: '36', label: 'U1' },
			{ id: '37', label: 'U2' },
			{ id: '38', label: 'U3' },
			{ id: '39', label: 'U4' },
			{ id: '40', label: 'Nipple ⦿' },
			{ id: '41', label: 'Fix' },
			{ id: '42', label: 'Select' },
			{ id: '43', label: 'Off' },
			{ id: '44', label: 'Temp' },
			{ id: '45', label: 'Top' },
			{ id: '46', label: 'On' },
			{ id: '47', label: '<<<' },
			{ id: '48', label: 'Learn' },
			{ id: '49', label: '>>>' },
			{ id: '50', label: 'Go -' },
			{ id: '51', label: 'Pause' },
			{ id: '52', label: 'Go +' },
			{ id: '53', label: 'Oops' },
			{ id: '54', label: 'Esc' },
			{ id: '55', label: 'Edit' },
			{ id: '56', label: 'Goto' },
			{ id: '57', label: 'Update' },
			{ id: '58', label: 'Time' },
			{ id: '59', label: 'Store' },
			{ id: '60', label: 'Blind' },
			{ id: '61', label: 'Freeze' },
			{ id: '62', label: 'Preview' },
			{ id: '63', label: 'Assign' },
			{ id: '64', label: 'Align' },
			{ id: '65', label: 'Blackout' },
			{ id: '66', label: 'View' },
			{ id: '67', label: 'Effect' },
			{ id: '68', label: 'MA' },
			{ id: '69', label: 'Delete' },
			{ id: '70', label: 'Page' },
			{ id: '71', label: 'Macro' },
			{ id: '72', label: 'Preset' },
			{ id: '73', label: 'Copy' },
			{ id: '74', label: 'Sequence' },
			{ id: '75', label: 'Cue' },
			{ id: '76', label: 'Executor' },
			{ id: '82', label: 'Channel' },
			{ id: '83', label: 'Fixture' },
			{ id: '84', label: 'Group' },
			{ id: '85', label: 'Move' },
			{ id: '86', label: '0' },
			{ id: '87', label: '1' },
			{ id: '88', label: '2' },
			{ id: '89', label: '3' },
			{ id: '90', label: '4' },
			{ id: '91', label: '5' },
			{ id: '92', label: '6' },
			{ id: '93', label: '7' },
			{ id: '94', label: '8' },
			{ id: '95', label: '9' },
			{ id: '96', label: '+' },
			{ id: '97', label: '-' },
			{ id: '98', label: '.' },
			{ id: '99', label: 'Full' },
			{ id: '100', label: 'Highlight' },
			{ id: '101', label: 'Solo' },
			{ id: '102', label: 'Thru' },
			{ id: '103', label: 'If' },
			{ id: '104', label: 'At' },
			{ id: '105', label: 'Clear' },
			{ id: '106', label: 'Please' },
			{ id: '107', label: 'Up' },
			{ id: '108', label: 'Set' },
			{ id: '109', label: 'Previous' },
			{ id: '110', label: 'Next' },
			{ id: '111', label: 'Down' },
			{ id: '116', label: 'Help' },
			{ id: '117', label: 'Backup' },
			{ id: '118', label: 'Setup' },
			{ id: '119', label: 'Tools' },
			{ id: '120', label: 'V1' },
			{ id: '121', label: 'V2' },
			{ id: '122', label: 'V3' },
			{ id: '123', label: 'V4' },
			{ id: '124', label: 'V5' },
			{ id: '125', label: 'V6' },
			{ id: '126', label: 'V7' },
			{ id: '127', label: 'V8' },
			{ id: '128', label: 'V9' },
			{ id: '129', label: 'V10' }
];

instance.prototype.CHOICES_DIRECTION = [
		{ id: '-1', label: 'CCW'},
		{ id: '1', label: 'CW'}
];

function instance(system, id, config) {
	var self = this;

	// Request id counter
	self.request_id = 0;
	self.login = false;
	// super-constructor
	instance_skel.apply(this, arguments);
	self.status(self.STATUS_WARNING, 'Initializing');
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
		self.status(self.STATUS_WARNING,'Logging in');
		self.socket.write("login "+self.config.user+" "+self.config.pass+"\r\n");
	}
	else if (self.login === false && data.match(/Logged in as User/) && !data.match(/guest/)) {
		self.login = true;
		self.status(self.STATUS_OK);
		debug("logged in");
	}
	else if (self.login === false && data.match(/no login/)) {
		debug("incorrect username/password");
		self.status(self.STATUS_ERROR, 'Incorrect user/pass');
		self.log('error', 'Incorrect username or password');
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
		self.socket = new TelnetSocket(self.config.host, 30000);

		self.socket.on('status_change', function (status, message) {
			if (status !== self.STATUS_OK) {
				self.status(status, message);
			}
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			debug("Connected");
			self.login = false;
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.log('error',"Network error: " + err.message);
		});

		// if we get any data, display it to stdout
		self.socket.on("data", function(buffer) {
			var indata = buffer.toString("utf8");
			self.incomingData(indata);
		});

		self.socket.on("iac", function(type, info) {
			// tell remote we WONT do anything we're asked to DO
			if (type == 'DO') {
				socket.write(new Buffer([ 255, 252, info ]));
			}

			// tell the remote DONT do whatever they WILL offer
			if (type == 'WILL') {
				socket.write(new Buffer([ 255, 254, info ]));
			}
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

	debug("destroy", self.id);
};

instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {

		'command': {
			label:'Run Command',
			options: [{
				type: 'textinput',
				label: 'Command',
				id: 'command'
			}]
		},
		'pushbutton': {
			label:'Push Button',
			options: [{
				type: 'dropdown',
				label: 'Button',
				id: 'pushbutton',
				choices: self.CHOICES_BUTTON
			}]
		},
		'relbutton': {
			label:'Release Button',
			options: [{
				type: 'dropdown',
				label: 'Button',
				id: 'relbutton',
				choices: self.CHOICES_BUTTON
			}]
		},
		'encoder1': {
			label:'Encoder 1',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder2': {
			label:'Encoder 2',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder3': {
			label:'Encoder 3',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder4': {
			label:'Encoder 4',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder5': {
			label:'Screen 1 Encoder Small screen',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder6': {
			label:'Screen 2 Encoder',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder7': {
			label:'Screen 3 Encoder',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder8': {
			label:'Screen 4 Encoder',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder',
				choices: self.CHOICES_DIRECTION
			}]
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var opt = action.options;
	// console.log("Sending some action", action);
	var cmd;

	switch (action.action){

		case 'command':
			cmd = opt.command;
			break;
		case 'pushbutton':
			cmd = `LUA 'gma.canbus.hardkey("${opt.pushbutton}", true, false)'`;
			break;
		case 'relbutton':
			cmd = `LUA 'gma.canbus.hardkey("${opt.relbutton}", false, false)'`;
			break;
		case 'encoder1':
			cmd = `LUA 'gma.canbus.encoder(0, "${opt.encoder}", false)'`;
			break;
		case 'encoder2':
			cmd = `LUA 'gma.canbus.encoder(1, "${opt.encoder}", false)'`;
			break;
		case 'encoder3':
			cmd = `LUA 'gma.canbus.encoder(2, "${opt.encoder}", false)'`;
			break;
		case 'encoder4':
			cmd = `LUA 'gma.canbus.encoder(3, "${opt.encoder}", false)'`;
			break;
		case 'encoder5':
			cmd = `LUA 'gma.canbus.encoder(4, "${opt.encoder}", false)'`;
			break;
		case 'encoder6':
			cmd = `LUA 'gma.canbus.encoder(5, "${opt.encoder}", false)'`;
			break;
		case 'encoder7':
			cmd = `LUA 'gma.canbus.encoder(6, "${opt.encoder}", false)'`;
			break;
		case 'encoder8':
			cmd = `LUA 'gma.canbus.encoder(7, "${opt.encoder}", false)'`;
			break;
	}

	if (cmd !== undefined) {

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.write(cmd+"\r\n");
		} else {
			debug('Socket not connected :(');
		}

	}
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
