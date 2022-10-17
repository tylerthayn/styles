
let examplesFolders = [
	'Viewer/examples',
	'bootstrap/site/content/docs/5.2/examples'
]
let themesFolder = 'themes'

let examples = {}
examplesFolders.forEach(examplesFolder => {
	$fs.readdirSync(examplesFolder, {withFileTypes: true}).forEach(entry => {
		if (entry.isDirectory() && !entry.name.endsWith('rtl')) {
			examples[entry.name] = $fs.readdirSync($path.join(examplesFolder, entry.name)).map(f=>$path.resolve(examplesFolder, entry.name, f))
		}
	})
})
$fs.writeFileSync('Viewer/examples.json', JSON.stringify(examples, null, 4), 'utf-8')

let themes = {}
$fs.readdirSync(themesFolder).forEach(entry => {
	themes[entry] = $path.resolve(themesFolder, entry, entry+'.css')
})
$fs.writeFileSync('Viewer/themes.json', JSON.stringify(themes, null, 4), 'utf-8')
