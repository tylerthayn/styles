let examples = {}
$(() => {
	$.get('themes.json', themes => {
		Object.keys(themes).forEach(theme => {
			let option = $(`<option value="${themes[theme]}">${theme}</option>`)
			$('select.Theme').append(option)
		})
	})
	$.get('examples.json', _examples => {
		examples = _examples
		Object.keys(examples).forEach(example => {
			let option = $(`<option value="${example}">${example}</option>`)
			$('select.Example').append(option)
		})
	})

	$('a').on('click', (event) => {event.preventDefault()})

	$('select.Theme').on('change', () => {
		if ($('head link.Theme').length > 0) {
			$('head link.Theme').prop('disabled', true)
			$('head link.Theme').remove()
		}
		if ($('select.Theme').val() != 'bootstrap') {
			$('head').append($(`<link rel="stylesheet" href="${$('select.Theme').val()}" class="Theme">`))
		}
	})

	$('select.Example').on('change', () => {
		$('.Main').empty()
		$('head link.Example').each((i, e) => {
			$(e).prop('disabled', true)
			$(e).remove()
		})

		examples[$('select.Example').val()].forEach(file => {
			if (file.endsWith('.css') && !file.includes('rtl')) {
				$('head').append($(`<link rel="stylesheet" href="${file}" class="Example">`))
			}
			if (file.endsWith('.html')) {
				$.get(file, html => {
					if (/---.+---/s.test(html)) {
						let config = YAML.parse(/---(.+?)---/s.exec(html)[1])
						if (config.extra_css) {
							if (typeof config.extra_css === 'string') {
								if (config.extra_css.startsWith('http')) {
									$('head').append($(`<link rel="stylesheet" href="${config.extra_css}" class="Example">`))
								}
							} else if (Array.isArray(config.extra_css)) {
								config.extra_css.forEach(css => {
									if (css.startsWith('http')) {
										$('head').append($(`<link rel="stylesheet" href="${css}" class="Example">`))
									}
								})
							}
						}
						console.log(config)
					}
					$('.Main').html(html.replace(/---.+?---/gs, ''))
				})
			}
		})
	})

	$('div.Selectors svg').on('click', () => {
		$('select.Theme').trigger('change')
		$('select.Example').trigger('change')
	})

})

function LoadExample (name) {
	$.get(`../examples/${name}.html`, html => {
		$('.Main').empty()
		$('.Main').append($(html))
	})
}
