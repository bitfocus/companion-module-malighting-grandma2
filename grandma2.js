var instance_skel = require('../../instance_skel');
var TelnetSocket = require('../../telnet');
var debug;
var log;

instance.prototype.CHOICES_BUTTON = [
		{ id: 'PAGE_CHANNEL_UP', label: 'Ch Pg +' },
		{ id: 'PAGE_CHANNEL_DOWN', label: 'Ch Pg -' },
		{ id: 'PAGE_FADER_UP', label: 'Fd Pg +' },
		{ id: 'PAGE_FADER_DOWN', label: 'Fd Pg -' },
		{ id: 'PAGE_BUTTON_UP', label: 'Bt Pg +' },
		{ id: 'PAGE_BUTTON_DOWN', label: 'Bt Pg -' },
		{ id: 'DEF_PAUSE', label: 'Pause Playback' },
		{ id: 'DEF_GO_MINUS', label: 'Go - Playback' },
		{ id: 'DEF_GO_PLUS', label: 'Go + Playback' },
		{ id: 'X1', label: 'X1' },
		{ id: 'X2', label: 'X2' },
		{ id: 'X3', label: 'X3' },
		{ id: 'X4', label: 'X4' },
		{ id: 'X5', label: 'X5' },
		{ id: 'X6', label: 'X6' },
		{ id: 'X7', label: 'X7' },
		{ id: 'X8', label: 'X8' },
		{ id: 'X9', label: 'X9' },
		{ id: 'X10', label: 'X10' },
		{ id: 'X11', label: 'X11' },
		{ id: 'X12', label: 'X12' },
		{ id: 'X13', label: 'X13' },
		{ id: 'X14', label: 'X14' },
		{ id: 'X15', label: 'X15' },
		{ id: 'X16', label: 'X16' },
		{ id: 'X17', label: 'X17' },
		{ id: 'X18', label: 'X18' },
		{ id: 'X19', label: 'X19' },
		{ id: 'X20', label: 'X20' },
		{ id: 'LIST', label: 'List' },
		{ id: 'USER1', label: 'User 1' },
		{ id: 'USER2', label: 'User 2' },
		{ id: 'U1', label: 'U1' },
		{ id: 'U2', label: 'U2' },
		{ id: 'U3', label: 'U3' },
		{ id: 'U4', label: 'U4' },
		{ id: 'ENCODER', label: 'Encoder ⦿' },
		{ id: 'FIX', label: 'Fix' },
		{ id: 'SELECT', label: 'Select' },
		{ id: 'OFF', label: 'Off' },
		{ id: 'TEMP', label: 'Temp' },
		{ id: 'TOP', label: 'Top' },
		{ id: 'ON', label: 'On' },
		{ id: 'GOM_FAST', label: '<<<' },
		{ id: 'LEARN', label: 'Learn' },
		{ id: 'GOP_FAST', label: '>>>' },
		{ id: 'GO_MINUS', label: 'Go -' },
		{ id: 'PAUSE', label: 'Pause' },
		{ id: 'GO_PLUS', label: 'Go +' },
		{ id: 'OOPS', label: 'Oops' },
		{ id: 'ESC', label: 'Esc' },
		{ id: 'EDIT', label: 'Edit' },
		{ id: 'GOTO', label: 'Goto' },
		{ id: 'UPDATE', label: 'Update' },
		{ id: 'TIME', label: 'Time' },
		{ id: 'STORE', label: 'Store' },
		{ id: 'BLIND', label: 'Blind' },
		{ id: 'FREEZE', label: 'Freeze' },
		{ id: 'PREVIEW', label: 'Preview' },
		{ id: 'ASSIGN', label: 'Assign' },
		{ id: 'ALIGN', label: 'Align' },
		{ id: 'BLACKOUT', label: 'Blackout' },
		{ id: 'VIEW', label: 'View' },
		{ id: 'EFFECT', label: 'Effect' },
		{ id: 'MA', label: 'MA' },
		{ id: 'DELETE', label: 'Delete' },
		{ id: 'PAGE', label: 'Page' },
		{ id: 'MACRO', label: 'Macro' },
		{ id: 'PRESET', label: 'Preset' },
		{ id: 'COPY', label: 'Copy' },
		{ id: 'SEQU', label: 'Sequence' },
		{ id: 'CUE', label: 'Cue' },
		{ id: 'EXEC', label: 'Executor' },
		{ id: 'CHANNEL', label: 'Channel' },
		{ id: 'FIXTURE', label: 'Fixture' },
		{ id: 'GROUP', label: 'Group' },
		{ id: 'MOVE', label: 'Move' },
		{ id: '0', label: '0' },
		{ id: '1', label: '1' },
		{ id: '2', label: '2' },
		{ id: '3', label: '3' },
		{ id: '4', label: '4' },
		{ id: '5', label: '5' },
		{ id: '6', label: '6' },
		{ id: '7', label: '7' },
		{ id: '8', label: '8' },
		{ id: '9', label: '9' },
		{ id: 'PLUSE', label: '+' },
		{ id: 'MINUS', label: '-' },
		{ id: 'DOT', label: '.' },
		{ id: 'FULL', label: 'Full' },
		{ id: 'HIGH', label: 'Highlight' },
		{ id: 'SOLO', label: 'Solo' },
		{ id: 'THRU', label: 'Thru' },
		{ id: 'IF', label: 'If' },
		{ id: 'AT', label: 'At' },
		{ id: 'CLEAR', label: 'Clear' },
		{ id: 'PLEASE', label: 'Please' },
		{ id: 'UP', label: 'Up' },
		{ id: 'SET', label: 'Set' },
		{ id: 'PREV', label: 'Previous' },
		{ id: 'NEXT', label: 'Next' },
		{ id: 'DOWN', label: 'Down' },
		{ id: 'HELP', label: 'Help' },
		{ id: 'BACKUP', label: 'Backup' },
		{ id: 'SETUP', label: 'Setup' },
		{ id: 'TOOLS', label: 'Tools' },
		{ id: 'V1', label: 'V1' },
		{ id: 'V2', label: 'V2' },
		{ id: 'V3', label: 'V3' },
		{ id: 'V4', label: 'V4' },
		{ id: 'V5', label: 'V5' },
		{ id: 'V6', label: 'V6' },
		{ id: 'V7', label: 'V7' },
		{ id: 'V8', label: 'V8' },
		{ id: 'V9', label: 'V9' },
		{ id: 'V10', label: 'V10' }
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

	debug("destroy", self.id);;
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
				id: 'encoder1',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder2': {
			label:'Encoder 2',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder2',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder3': {
			label:'Encoder 3',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder3',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder4': {
			label:'Encoder 4',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder4',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder5': {
			label:'Screen 1 Encoder Small screen',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder5',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder6': {
			label:'Screen 2 Encoder',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder6',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder7': {
			label:'Screen 3 Encoder',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder7',
				choices: self.CHOICES_DIRECTION
			}]
		},
		'encoder8': {
			label:'Screen 4 Encoder',
			options: [{
				type: 'dropdown',
				label: 'Direction',
				id: 'encoder8',
				choices: self.CHOICES_DIRECTION
			}]
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var opt = action.options;
	console.log("Sending some action", action);
	var cmd;

	switch (action.action){

		case 'command':
			cmd = opt.command;
			break;
		case 'pushbutton':
			cmd = 'LUA \'gma.canbus.hardkey(\"'+ opt.pushbutton +'\", true, false)\'';
			break;
		case 'relbutton':
			cmd = 'LUA \'gma.canbus.hardkey(\"'+ opt.relbutton +'\", false, false)\'';
			break;
		case 'encoder1':
			cmd = 'LUA \'gma.canbus.encoder(0, '+ opt.encoder1 +', pressed, false)\'';
			break;
		case 'encoder2':
			cmd = 'LUA \'gma.canbus.encoder(0, '+ opt.encoder2 +', pressed, false)\'';
			break;
		case 'encoder3':
			cmd = 'LUA \'gma.canbus.encoder(0, '+ opt.encoder3 +', pressed, false)\'';
			break;
		case 'encoder4':
			cmd = 'LUA \'gma.canbus.encoder(0, '+ opt.encoder4 +', pressed, false)\'';
			break;
		case 'encoder5':
			cmd = 'LUA \'gma.canbus.encoder(0, '+ opt.encoder5 +', pressed, false)\'';
			break;
		case 'encoder6':
			cmd = 'LUA \'gma.canbus.encoder(0, '+ opt.encoder6 +', pressed, false)\'';
			break;
		case 'encoder7':
			cmd = 'LUA \'gma.canbus.encoder(0, '+ opt.encoder7 +', pressed, false)\'';
			break;
		case 'encoder8':
			cmd = 'LUA \'gma.canbus.encoder(0, '+ opt.encoder8 +', pressed, false)\'';
			break;
	};

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
