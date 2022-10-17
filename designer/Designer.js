define(['jquery', '@js/core'], ($) => {

	function Designer () {
		this.styleSheet = null

		$(() => {
			this.Init()
		})


	}

	Designer.prototype.Init = function () {
		for(i=0; i<document.styleSheets.length; i++) {
			if (document.styleSheets[i].title == '@tyler.thayn/styles') {
				let rules = document.styleSheets[i].rules
				for (i=0; i<rules.length; i++) {
					let c = rules[i].selectorText.replace(/^\./, '')
					$('.ClassControls').append($(`
						<div class="form-check">
							<input class="form-check-input" type="checkbox" value="${c}" id="style${i}" name="${c}">
							<label class="form-check-label" for="style${i}">${c}</label>
						</div>`))
				}
				$('input[type=checkbox]').on('change', function (event) {
					if (this.checked) {
						$('div.Component').children().addClass($(this).val())
					} else {
						$('div.Component').children().removeClass($(this).val())
					}

				})

			}
		}

		$('#ComponentSelect').on('change', () => {
			if ($('#ComponentSelect').val() != null) {
				this.LoadComponent($('#ComponentSelect').val())
			}
		})
		$('#Background').on('change', () => {
			for(i=0; i<$('div.Component').children()[0].classList.length; i++) {
				if ($('div.Component').children()[0].classList[i].startsWith('bg-')) {
					$($('div.Component').children()[0]).removeClass($('div.Component').children()[0].classList[i])
				}
			}
			$($('div.Component').children()[0]).addClass($('#Background').val())
		})

	}

	Designer.prototype.LoadComponent = function (name) {
		$.get('components/'+name+'.html', html => {
			$(html).each((i, e) => {
				if (e instanceof HTMLStyleElement) {
					$('head').append(e)
				}
				if (e instanceof HTMLElement) {
					$('.Component').append(e)

					while ($('#ElementSelect')[0].options.length > 0) {
						$('#ElementSelect')[0].options.remove(0)
					}

					$('div.Component [data-config]').each((i, ee) => {
						$('#ElementSelect').append($(`<option value="${$(ee).data('config')}">${$(ee).data('config')}</option>`))
					})

				}
			})

		})
	}

	Designer.prototype.StylesClasses = function (pattern) {
		if (this.styleSheet == null) {return []}

		let rules = []
		for (i=0; i<this.styleSheet.rules.length; i++) {
			if (pattern.test(this.styleSheet.rules[i].selectorText)) {
				rules.push(this.styleSheet.rules[i].selectorText)
			}
		}
		return rules
	}

	return Designer
})
