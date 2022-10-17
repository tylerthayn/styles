
let themes = []
$fs.readdirSync('./src', {withFileTypes: true}).forEach(entry => {
	if (entry.isFile() && /^bootstrap\..+\.css$/i.test(entry.name)) {
		themes.push(entry.name.split('.')[1])
	}
	$fs.writeFileSync('./src/themes.json', JSON.stringify(themes, null, 4), 'utf-8')
})
