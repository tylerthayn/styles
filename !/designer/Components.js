requirejs.config({
	paths: {
		jquery: '../node_modules/jquery/dist/jquery',
		'@js/core': '../node_modules/@tyler.thayn/js.core/index',
		lodash: '../node_modules/lodash/lodash'
	}
})

require(['jquery', 'lodash', '@js/core'], ($, lodash) => {

	$(() => {
		LoadComponentsList()
		$('#ComponentSelect').on('change', LoadComponent)


	})

	function LoadComponent () {
		$.get($('#ComponentSelect').val(), html => {
			$('div.Component').append($(html))
		})
	}

	function LoadComponentsList () {
		return new Promise((resolve, reject) => {
			$.get('components.json', data => {
			data.folder = data.folder.endsWith('/') ? data.folder : data.folder+'/'
				data.components.Keys().forEach(name => {
					$('#ComponentSelect').append($(`<option value="${data.folder}${data.components[name]}">${name}</option>`))
				})
				resolve()
			}).fail(reject)
		})
	}

})
