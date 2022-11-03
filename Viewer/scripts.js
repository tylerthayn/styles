let examples = {}
$(() => {
	$.get('schemes.json', schemes => {
		Object.keys(schemes).forEach(scheme => {
			let option = $(`<option value="${schemes[scheme]}">${scheme}</option>`)
			$('select.Scheme').append(option)
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

	$('select.Scheme').on('change', () => {
		if ($('head link.Scheme').length > 0) {
			$('head link.Scheme').prop('disabled', true)
			$('head link.Scheme').remove()
		}
		if ($('select.Scheme').val() == 'bootstrap') {
			$('head').append($(`<link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css" class="Scheme">`))
		} else if ($('select.Scheme').val() == 'tts') {
			$('head').append($(`<link rel="stylesheet" href="../src/scss/tts.css" class="Scheme">`))
		} else {
			$('head').append($(`<link rel="stylesheet" href="${$('select.Scheme').val()}" class="Scheme">`))
		}
	})

	$('select.Theme').on('change', () => {
		$('.Viewer').SetTheme($('select.Theme').val())
		//$('.Viewer').removeClass('theme-primary theme-secondary theme-dark theme-light')
		//$('.Viewer').addClass(`theme-${$('select.Theme').val()}`)
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
		$('select.Scheme').trigger('change')
		$('select.Example').trigger('change')
	})

})
