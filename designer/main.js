requirejs.config({
	paths: {
		jquery: '../node_modules/jquery/dist/jquery',
		'@js/core': '../node_modules/@tyler.thayn/js.core/index',
		lodash: '../node_modules/lodash/lodash'
	}
})

require(['jquery', 'Designer'], ($, Designer) => {

	window.designer = new Designer()




})
