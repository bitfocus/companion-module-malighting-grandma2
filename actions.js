import * as CHOICES from './choices.js'

function ar2obj(a) {
	return a.map((e, i) => ({ id: parseInt(i), label: `${e} (${i + 1})` }))
}

export function compileActionDefinitions(self) {
	const sendCommand = async (action, cmd) => {
		if (self.socket !== undefined && self.socket.isConnected) {
			self.socket.send(cmd + '\r\n')
		} else {
			self.log('debug', 'Socket not connected :(')
		}
	}

	let actionDefs = {
		'command': {
			name: 'Run Custom Command',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Command',
					id: 'command',
				},
			],
			callback: async (action, context) => {
				let lua = await context.parseVariablesInString(action.options.command)
				await sendCommand(action, lua)
			},
		},
		'button': {
			name: 'Button Press/Release',
			options: [
				{
					type: 'dropdown',
					label: 'Button',
					id: 'button',
					default: 11,
					choices: CHOICES.BUTTON,
				},
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'dir',
					default: 'true',
					choices: CHOICES.DOWN_UP,
				},
			],
			callback: async (action, context) => {
				let opt = action.options
				let lua = `LUA 'gma.canbus.hardkey(${opt.button}, ${opt.dir}, false)'`
				await sendCommand(action, lua)
			},
		},
		wheel: {
			name: 'Move wheel up/down',
			options: [
				{
					type: 'textinput',
					label: 'Steps to move wheel (+/-)',
					tooltip: 'Negative numbers move down',
					id: 'steps',
					default: 1,
					width: 3,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				let opt = action.options
				let steps = parseInt(await context.parseVariablesInString(opt.steps))
				let lua = `LUA 'gma.canbus.wheel(${steps})'`
				await sendCommand(action, lua)
			},
		},
	}

	let cmd = `encoder`
	let encOpt = [
		{
			type: 'checkbox',
			label: 'Use variable for encoder',
			id: 'encoder_from_variable',
			default: false,
		},
		{
			type: 'dropdown',
			label: 'Select Encoder',
			id: 'enc',
			default: 1,
			choices: ar2obj(CHOICES.ENCODER),
			isVisible: (options) => !options.encoder_from_variable,
		},
		{
			type: 'textinput',
			label: 'Encoder Number (1-8)',
			id: 'encoder_variable',
			default: 1,
			isVisible: (options) => !!options.encoder_from_variable,
			useVariables: true,
		},
	]

	actionDefs[cmd] = {
		name: 'Rotate Encoder',
		options: [
			{
				type: 'dropdown',
				label: 'Direction',
				id: 'dir',
				choices: CHOICES.DIRECTION,
			},
			{
				type: 'number',
				label: 'Steps',
				tooltip: 'Adjust by how much per click?',
				id: 'steps',
				default: 1,
				min: 1,
				max: 100,
			},
		],
	}
	actionDefs[cmd].options.unshift(...encOpt)
	actionDefs[cmd].callback = async (action, context) => {
		let opt = action.options
		let dir = opt.dir * parseInt(opt.steps || 1)
		let enc = !opt.encoder_from_variable
			? opt.enc
			: Math.min(7, Math.max(0, parseInt(await context.parseVariablesInString(opt.encoder_variable)) - 1))

		let lua = `LUA 'gma.canbus.encoder(${enc}, ${dir}, nil)'`
		await sendCommand(action, lua)
	}
	cmd += '_p' // press encoder action
	actionDefs[cmd] = {
		name: 'Encoder Press/Release',
		options: [
			{
				type: 'dropdown',
				label: 'Direction',
				id: 'dir',
				choices: CHOICES.DOWN_UP,
			},
		],
	}
	actionDefs[cmd].options.unshift(...encOpt)
	actionDefs[cmd].callback = async (action, context) => {
		let opt = action.options
		let enc = !opt.encoder_from_variable
			? opt.enc
			: Math.min(7, Math.max(0, parseInt(await context.parseVariablesInString(opt.encoder_variable)) - 1))

		let lua = `LUA 'gma.canbus.encoder(${enc}, nil, ${opt.dir})'`
		await sendCommand(action, lua)
	}

	return actionDefs
}
