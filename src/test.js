let Color = require('./Color')
let Chroma = require('chroma-js')
let Theme = require('./Theme')

let c = new Color('#336699')


let PrimaryColors = [Chroma(c.hex).darken().hex(), c.hex, Chroma(c.hex).brighten().hex()]



function Gradient (color) {
	c = new Color(color)
	return `linear-gradient(${c.Lighten(15).hex}, ${c.hex} 50%, ${c.Darken(5).hex})`
}


let theme = new Theme({
	name: 'Dark',
	prefix: 'tts-',
	containers: PrimaryColors.map(color => {
		let vars = {
			bg: color,
			bgimage: Gradient(color),
			margin: '0px',
			padding: '0px',
			color: '#ffffff'
		}

		return new Theme.Container({
			header: new Theme.Section('header', vars),
			footer: new Theme.Section('footer', vars)
		})
	})
})
theme.Render()
