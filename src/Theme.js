
function Section (name = '', vars = {}) {
	this.name = name
	this.vars = Extend({}, vars)

	return this;
}

Section.prototype.Render = function (prefix, level) {
	Object.keys(this.vars).forEach(key => {
		log(`\t--${prefix}l${level}-${this.name}-${key}: ${this.vars[key]};`)
	})
}

function Container (options = {}) {
	Extend(this, options)

	return this;
}

Container.prototype.Render = function (prefix, level) {
	Object.keys(this).forEach(key => {
		if (Reflect.has(this[key], 'Render')) {
			this[key].Render(prefix, level)
		}
	})
}


let defaults = {
	containers: [],
	name: '',
	prefix: 'tts-'
}

function Theme (options = {}) {
	Extend(this, defaults, options)

	return this;
}

Theme.prototype.Render = function () {
	let vars = []

	log(':root {')
	Object.keys(this).forEach(key => {
		if (Array.isArray(this[key])) {
			this[key].forEach((item, index) => {
				if (Reflect.has(item, 'Render')) {
					item.Render(this.prefix, index)
				}
			})
		} else if (typeof this[key] === 'object') {
			if (Reflect.has(this[key], 'Render')) {
				this[key].Render(this.prefix, index)
			}
		}
	})
	log('}')

}

Define(Theme, 'Section', Section)
Define(Theme, 'Container', Container)


module.exports = Theme

