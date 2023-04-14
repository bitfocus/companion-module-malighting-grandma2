export const UpgradeScripts = [
	function (context, props) {
		const result = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		for (let action of props.actions) {
			let changed = false
			if ('pushbutton' == action.actionId) {
				action.actionId = 'button'
				action.options.dir = 'true'
				action.options.button = action.options.pushbutton
				delete action.options.pushbutton
				changed = true
			}
			if ('relbutton' == action.actionId) {
				;(action.actionId = 'button'), (action.options.dir = 'false')
				action.options.button = action.options.relbutton
				delete action.options.relbutton
				changed = true
			}
			let m = action.actionId.match(/encoder(\d)/)
			if (m) {
				action.actionId = 'encoder'
				action.options.enc = m[1]
				action.options.encoder_from_variable = false
				action.options.dir = action.options.encoder || 1
				action.options.steps = 1
				delete action.options.encoder
				changed = true
			}
			if (changed) {
				result.updatedActions.push(action)
			}
		}

		return result
	},
]
