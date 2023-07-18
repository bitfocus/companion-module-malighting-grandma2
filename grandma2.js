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
		if (!this.login) {
			if (data.match(/Please login/)) {
				this.updateStatus(InstanceStatus.Connecting, 'Logging in')
				this.log('info', 'Logging In')
				this.socket.send('login ' + this.config.user + ' ' + this.config.pass + '\r\n')
			} else if (data.match(/Logged in as User/) && !data.match(/guest/)) {
				this.login = true
				this.updateStatus(InstanceStatus.Ok, 'Logged in')
				this.log('info', 'logged in')
			} else if (data.match(/no login/)) {
				this.updateStatus(InstanceStatus.ConnectionFailure, 'Incorrect user/pass')
				this.log('warn', 'Incorrect username or password')
			}
		}
	}

	init_tcp() {

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
			this.login = false
		}
		if (this.socketTimer) {
			clearInterval(this.socketTimer)
			delete this.socketTimer
		}

		if (this.config.host) {
			this.socket = new TelnetSocket(this.config.host, 30000)

			this.socket.on('error', (err) => {
				this.log('error', 'Network error: ' + err.message)
				this.login = false
				// set timer to retry connection in 10 secs
				if (this.socketTimer) {
					clearInterval(this.socketTimer)
					delete this.socketTimer
				}
				if (this.socket) {
					this.socket.destroy()
					delete this.socket
				}
				this.socketTimer = setInterval( () => {
					this.updateStatus(InstanceStatus.Connecting, 'Retrying connection')
					this.init_tcp()
				}, 10000)
			})

			this.socket.on('connect', () => {
				this.log('debug', 'Connected')
				this.login = false
			})

			this.socket.on('status_change', (status, message) => {
				if (status == 'ok' || status == 'connecting') {
					// ignore
				} else if (message == 'read ECONNRESET') {
					this.socket.emit('end')
				} else {
					this.log('debug', status + ' ' + message)
				}
			})

			this.socket.on('end', () => {
				this.log('error', 'Console disconnected')
				this.login = false
				this.updateStatus(InstanceStatus.Error, 'Disconnected')
				if (this.socket) {
					this.socket.destroy()
					delete this.socket
				}
				// set timer to retry connection in 10 secs
				if (this.socketTimer) {
					clearInterval(this.socketTimer)
					delete this.socketTimer
				}

				this.socketTimer = setInterval( () => {
					this.updateStatus(InstanceStatus.Connecting, 'Retrying connection')
					this.init_tcp()
				}, 10000)
			})

			this.socket.on('data', (buffer) => {
				var indata = buffer.toString('utf8')
				this.incomingData(indata)
			})

			this.socket.on('iac', (type, info) => {
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
