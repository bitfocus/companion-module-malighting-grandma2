import assert from 'node:assert/strict'
import test from 'node:test'
import { compileActionDefinitions } from './actions.js'

function fixture() {
	const sent = []
	const self = { socket: { isConnected: true, send: (command) => sent.push(command) }, log() {} }
	const context = { parseVariablesInString: async (value) => typeof value === 'string' ? value.replace('$(custom:value)', '3') : value }
	return { self, sent, context, actions: compileActionDefinitions(self) }
}

test('custom commands and button presses retain Telnet CRLF framing', async () => {
	const { actions, sent, context } = fixture()
	await actions.command.callback({ options: { command: 'Go Executor $(custom:value)' } }, context)
	await actions.button.callback({ options: { button: 11, dir: 'true' } }, context)
	assert.deepEqual(sent, ['Go Executor 3\r\n', "LUA 'gma.canbus.hardkey(11, true, false)'\r\n"])
})

test('wheel and encoder actions resolve variables and preserve indexing and direction', async () => {
	const { actions, sent, context } = fixture()
	await actions.wheel.callback({ options: { steps: '-$(custom:value)' } }, context)
	await actions.encoder.callback({ options: { encoder_from_variable: true, encoder_variable: '$(custom:value)', steps: 2, dir: -1 } }, context)
	await actions.encoder_p.callback({ options: { encoder_from_variable: false, enc: 7, dir: 'false' } }, context)
	assert.deepEqual(sent, ["LUA 'gma.canbus.wheel(-3)'\r\n", "LUA 'gma.canbus.encoder(2, -2, nil)'\r\n", "LUA 'gma.canbus.encoder(7, nil, false)'\r\n"])
	const options = actions.encoder.options
	assert.equal(options.find((o) => o.id === 'enc').isVisible({ encoder_from_variable: true }), false)
	assert.equal(options.find((o) => o.id === 'encoder_variable').isVisible({ encoder_from_variable: true }), true)
})

test('disconnected actions do not send commands', async () => {
	const { self, actions, sent, context } = fixture()
	self.socket.isConnected = false
	await actions.command.callback({ options: { command: 'Go' } }, context)
	delete self.socket
	await actions.command.callback({ options: { command: 'Go' } }, context)
	assert.deepEqual(sent, [])
})

test('numeric defaults pass through parsing as in SDK 1.15.1', async () => {
	const { actions, sent, context } = fixture()
	await actions.wheel.callback({ options: { steps: 1 } }, context)
	await actions.encoder.callback({ options: { encoder_from_variable: true, encoder_variable: 1, dir: 1, steps: 1 } }, context)
	assert.deepEqual(sent, ["LUA 'gma.canbus.wheel(1)'\r\n", "LUA 'gma.canbus.encoder(0, 1, nil)'\r\n"])
})
