let Chroma = require('chroma-js')

let steps = {
	light: [1,1.5,2],
	dark: [1,1.5,2]
}

let colors = {
	black: '#000',
	blue: '#336699',
	cyan: '#3399F3',
	dark: '#003c6b',
	green: '#3CB521',
	light: '#6693ca',
	primary: '#336699',
	purple: '#6f42c1',
	red: '#CD0200',
	secondary: '#999999',
	white: '#fff',
	yellow: '#D47500'
}

let _colors = {}

let vars = []


Object.keys(colors).forEach(color => {
	vars.push(`\t--${color}: ${colors[color]};`)
	vars.push(`\t--${color}-d1: ${Chroma(colors[color]).darken().hex()};`)
	vars.push(`\t--${color}-d2: ${Chroma(colors[color]).darken(2).hex()};`)
	vars.push(`\t--${color}-b1: ${Chroma(colors[color]).brighten().hex()};`)
	vars.push(`\t--${color}-b2: ${Chroma(colors[color]).brighten(2).hex()};`)

	_colors[color] = {
		dark: steps.dark.map(step => Chroma(colors[color]).darken(step).hex()),
		light: steps.light.map(step => Chroma(colors[color]).brighten(step).hex()),
		base: colors[color]
	}
})

log('<html><head><link rel="stylesheet" href="tts.css"><body>\n')
log(`<style>\n:root {\n`+vars.join('\n')+`\n}\n</style>`)

Object.keys(colors).forEach(color => {
	log(`
		<div class="ColorRow">
			<div class="bg-${color}-b2" style="width:75px;height:50px;"></div>
			<div class="bg-${color}-b1" style="width:75px;height:50px;"></div>
			<div class="bg-${color}" style="width:75px;height:50px;"></div>
			<div class="bg-${color}-d1" style="width:75px;height:50px;"></div>
			<div class="bg-${color}-d2" style="width:75px;height:50px;"></div>
		</div>
	`)
})

log('\n</body></html>\n')

//logj(_colors)

