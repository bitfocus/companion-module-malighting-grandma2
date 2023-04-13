/* eslint-disable no-useless-escape */
import { Regex, TelnetHelper } from '@companion-module/base'
import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import * as CHOICES from './choices.js'
import { compileActionDefinitions } from './actions.js'
import { UpgradeScripts } from './upgrades.js'

const TelnetSocket = TelnetHelper

class MA2Instance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.login = false
	}

	async configUpdated(config) {
		this.login = false
		this.destroy()
		this.config = config
		this.init_tcp()
	}

	async init(config) {
		this.config = config

		this.setActionDefinitions(compileActionDefinitions(this)) // export actions
		this.init_tcp()
	}

	// When module gets deleted
	destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}
	}

	incomingData(data) {
		if (process.env.DEVELOPER) {
			this.log('debug', data)
		}
		if (this.login === false && data.match(/Please login/)) {
			this.updateStatus(InstanceStatus.Connecting, 'Logging in')
			this.log('info', 'Logging In')
			this.socket.send('login ' + this.config.user + ' ' + this.config.pass + '\r\n')
		} else if (this.login === false && data.match(/Logged in as User/) && !data.match(/guest/)) {
			this.login = true
			this.updateStatus(InstanceStatus.Ok, 'Logged in')
			this.log('info', 'logged in')
		} else if (this.login === false && data.match(/no login/)) {
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Incorrect user/pass')
			this.log('warn', 'Incorrect username or password')
		}
	}

	init_tcp() {
		let self = this

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
			this.login = false
		}

		if (this.config.host) {
			this.socket = new TelnetSocket(this.config.host, 30000)

			this.socket.on('error', function (err) {
				self.log('error', 'Network error: ' + err.message)
			})

			this.socket.on('connect', function () {
				self.log('debug', 'Connected')
				self.login = false
			})

			// if we get any data, display it to stdout
			this.socket.on('data', function (buffer) {
				var indata = buffer.toString('utf8')
				self.incomingData(indata)
			})

			this.socket.on('iac', function (type, info) {
				// tell remote we WONT do anything we're asked to DO
				if (type == 'DO') {
					socket.write(Buffer.from([255, 252, info]))
				}

				// tell the remote DONT do whatever they WILL offer
				if (type == 'WILL') {
					socket.write(Buffer.from([255, 254, info]))
				}
			})
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'Remember to activate Telnet Remote in Setup -> Console -> Global Settings -> Telnet',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'grandMA2 Console IP',
				width: 12,
				default: '192.168.0.1',
				regex: Regex.IP,
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
				default: 'admin',
			},
		]
	}

	// parse(value) {
	// 	var self = this

	// 	self.parseVariables(value, (parsed) => {
	// 		value = parsed
	// 	})

	// 	return value
	// }

	// instance.prototype.action = function (action) {
	// 	var self = this
	// 	var opt = action.options
	// 	var cmd

	// 	switch (action.action) {
	// 		case 'command':
	// 			cmd = self.parse(opt.command)
	// 			break
	// 		case 'pushbutton':
	// 			cmd = `LUA 'gma.canbus.hardkey("${opt.pushbutton}", true, false)'`
	// 			break
	// 		case 'relbutton':
	// 			cmd = `LUA 'gma.canbus.hardkey("${opt.relbutton}", false, false)'`
	// 			break
	// 		case 'encoder1':
	// 			cmd = `LUA 'gma.canbus.encoder(0, "${opt.encoder}", nil)'`
	// 			break
	// 		case 'encoder2':
	// 			cmd = `LUA 'gma.canbus.encoder(1, "${opt.encoder}", false)'`
	// 			break
	// 		case 'encoder3':
	// 			cmd = `LUA 'gma.canbus.encoder(2, "${opt.encoder}", false)'`
	// 			break
	// 		case 'encoder4':
	// 			cmd = `LUA 'gma.canbus.encoder(3, "${opt.encoder}", false)'`
	// 			break
	// 		case 'encoder5':
	// 			cmd = `LUA 'gma.canbus.encoder(4, "${opt.encoder}", false)'`
	// 			break
	// 		case 'encoder6':
	// 			cmd = `LUA 'gma.canbus.encoder(5, "${opt.encoder}", false)'`
	// 			break
	// 		case 'encoder7':
	// 			cmd = `LUA 'gma.canbus.encoder(6, "${opt.encoder}", false)'`
	// 			break
	// 		case 'encoder8':
	// 			cmd = `LUA 'gma.canbus.encoder(7, "${opt.encoder}", false)'`
	// 			break
	// 	}

	// 	if (cmd !== undefined) {
	// 		if (self.socket !== undefined && self.socket.connected) {
	// 			self.socket.write(cmd + '\r\n')
	// 		} else {
	// 			debug('Socket not connected :(')
	// 		}
	// 	}
	// }
}

runEntrypoint(MA2Instance, UpgradeScripts)
