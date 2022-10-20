//define(['jquery'], (core, $) => {
(function () {
	let defaults = {
		parents:false
	}

	let ThemeObserver = (element, opts = {}) => {
		let options = $.extend({}, defaults, opts)

		function ObserveParents () {
			if (options.parents) {
				$(element).parents(options.parents).each((i, e) => {
					ThemeObserver(e)
					$(e).on('theme-changed', function (event, theme) {
						theme.parent = this
						$(element).triggerHandler('theme-changed', theme)
					})
				})
			}
		}


		if ($(element).data('theme-observer')) {
			ObserveParents()
			return $(element).data('theme-observer')
		}


		let observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				let theme = {
					'old': mutation.oldValue.match(/\btheme-(.+)\b/) != null ? mutation.oldValue.match(/\btheme-(.+)\b/)[1] : null,
					'new': $(mutation.target).prop(mutation.attributeName).match(/\btheme-(.+)\b/) != null ? $(mutation.target).prop(mutation.attributeName).match(/\btheme-(.+)\b/)[1] : null
				}
				if (theme['old'] != theme['new']) {
					$(mutation.target).triggerHandler('theme-changed', theme)
				}
			})
		})

		observer.observe(element, {attributeOldValue: true, attributes: true, attributesFilter: ['class']})
		Object.defineProperty(observer, '_options', {get: () => {return options}})
		$(element).data('theme-observer', observer)

		ObserveParents()
		return observer
	}


	$.fn.extend({
		ObserveTheme: function (...args) {
			let fn = args.last instanceof Function ? args.pop() : null
			let options = args.length > 0 && typeof args.first === 'object' ? args.shift() : {}

			this.each((i, e) => {
				ThemeObserver(e, options)
				if (fn != null) {
					$(e).on('theme-changed', (event, theme) => {
						if (theme.parent) {
							if (Reflect.has(options, 'parents')) {
								if ($(e).parents(options.parents).filter(theme.parent).length > 0) {
									fn.call(e, event, theme)
								}
							}
						} else {
							fn.call(e, event, theme)
						}
					})
				}
			})
		}
	})

	$.fn.extend({
		'SetTheme': function (theme) {
			this.each((i, e) => {
				$(e).attr('class', $(e).attr('class').split(' ').filter(c=>!c.startsWith('theme-')).join(' ')+' theme-'+theme)
			})
		}
	})


	$(() => {
		$('.Viewer').ObserveTheme((event, theme) => {
			logj(theme)
		})
	})

})()
//})
