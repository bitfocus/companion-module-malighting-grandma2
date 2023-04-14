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

	incomingData(data, self) {
		if (process.env.DEVELOPER) {
			self.log('debug', data)
		}
		if (!self.login) {
			if (data.match(/Please login/)) {
				self.updateStatus(InstanceStatus.Connecting, 'Logging in')
				self.log('info', 'Logging In')
				self.socket.send('login ' + this.config.user + ' ' + this.config.pass + '\r\n')
			} else if (data.match(/Logged in as User/) && !data.match(/guest/)) {
				self.login = true
				self.updateStatus(InstanceStatus.Ok, 'Logged in')
				self.log('info', 'logged in')
			} else if (data.match(/no login/)) {
				self.updateStatus(InstanceStatus.ConnectionFailure, 'Incorrect user/pass')
				self.log('warn', 'Incorrect username or password')
			}
		}
	}

	init_tcp() {
		let self = this

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
			this.login = false
		}
		if (self.socketTimer) {
			clearInterval(self.socketTimer)
			delete self.socketTimer
		}

		if (this.config.host) {
			this.socket = new TelnetSocket(this.config.host, 30000)

			this.socket.on('error', function (err) {
				self.log('error', 'Network error: ' + err.message)
				self.login = false
				// set timer to retry connection in 10 secs
				if (self.socketTimer) {
					clearInterval(self.socketTimer)
					delete self.socketTimer
				}
				if (self.socket) {
					self.socket.destroy()
					delete self.socket
				}
				self.socketTimer = setInterval(function () {
					self.updateStatus(InstanceStatus.Connecting, 'Retrying connection')
					self.init_tcp()
				}, 10000)
			})

			this.socket.on('connect', function () {
				self.log('debug', 'Connected')
				self.login = false
			})

			this.socket.on('status_change', function (status, message) {
				if (status == 'ok' || status == 'connecting') {
					// ignore
				} else if (message == 'read ECONNRESET') {
					self.socket.emit('end')
				} else {
					self.log('debug', status + ' ' + message)
				}
			})

			this.socket.on('end', function () {
				self.log('error', 'Console disconnected')
				self.login = false
				self.updateStatus(InstanceStatus.Error, 'Disconnected')
				if (self.socket) {
					self.socket.destroy()
					delete self.socket
				}
				// set timer to retry connection in 10 secs
				if (self.socketTimer) {
					clearInterval(self.socketTimer)
					delete self.socketTimer
				}

				self.socketTimer = setInterval(function () {
					self.updateStatus(InstanceStatus.Connecting, 'Retrying connection')
					self.init_tcp()
				}, 10000)
			})

			this.socket.on('data', function (buffer) {
				var indata = buffer.toString('utf8')
				self.incomingData(indata, self)
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
}
runEntrypoint(MA2Instance, UpgradeScripts)
