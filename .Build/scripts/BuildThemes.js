let ChildProcess = require('child_process')
let sassCmd = $path.join($path.dirname(process.argv[0]), 'sass.cmd')

let themes = $fs.readdirSync($path.resolve('./themes')).filter(theme=>theme != 'themes.json')
themes.forEach(theme => {
	process.stdout.write('Building '+theme+'...')
	let scss = []
	if ($fs.pathExistsSync('src/scss/_variables.scss')) {scss.push(`@import 'src/scss/_variables.scss';`)}
	if ($fs.pathExistsSync(`themes/${theme}/_variables.scss`)) {scss.push(`@import 'themes/${theme}/_variables.scss';`)}
	if ($fs.pathExistsSync('node_modules/bootstrap/scss/bootstrap.scss')) {scss.push(`@import 'node_modules/bootstrap/scss/bootstrap.scss';`)}
	if ($fs.pathExistsSync(`themes/${theme}/custom.scss`)) {scss.push(`@import 'themes/${theme}/custom.scss';`)}
	if ($fs.pathExistsSync('src/scss/custom.scss')) {scss.push(`@import 'src/scss/custom.scss';`)}
	scss = scss.join('\n')

	$fs.ensureDirSync(`.Build/tmp`)
	$fs.writeFileSync(`.Build/tmp/${theme}.scss`, scss, 'utf-8')

	let sass = ChildProcess.spawnSync(sassCmd, ['--stdin', `themes/${theme}/${theme}.css`, '--no-source-map'], {
		input: scss
	})

	if (sass.error) {
		throw new Error(sass.error)
	}
	process.stdout.write(sass.status+'\n')
})

let _themes = {}
themes.forEach(theme => {
	_themes[theme] = $path.resolve(`./themes/${theme}/${theme}.css`).replace(/\\+/g, '/')
})
