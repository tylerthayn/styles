let ChildProcess = require('child_process')
let sassCmd = $path.join($path.dirname(process.argv[0]), 'sass.cmd')

let themes = process.argv.length > 2 ? [process.argv[2]] : $fs.readdirSync($path.resolve('./Viewer/themes'))

themes.forEach(theme => {
	process.stdout.write('Building '+theme+'...')
	let scss = []
	//if ($fs.pathExistsSync('src/scss/_variables.scss')) {scss.push(`@import 'src/scss/_variables.scss';`)}
	if ($fs.pathExistsSync(`Viewer/themes/${theme}/_variables.scss`)) {
		scss.push(`@import 'Viewer/themes/${theme}/_variables.scss';`)
	} else {
//		scss.push(`@import 'src/scss/_variables.scss';`)
	}
	if ($fs.pathExistsSync('node_modules/bootstrap/scss/bootstrap.scss')) {scss.push(`@import 'node_modules/bootstrap/scss/bootstrap.scss';`)}

	if ($fs.pathExistsSync(`Viewer/themes/${theme}/custom.scss`)) {
		scss.push(`@import 'Viewer/themes/${theme}/custom.scss';`)
	} else {
//		scss.push(`@import 'src/scss/custom.scss';`)
	}
	//if ($fs.pathExistsSync('src/scss/custom.scss')) {scss.push(`@import 'src/scss/custom.scss';`)}
	scss = scss.join('\n')

	$fs.ensureDirSync(`.Build/tmp`)
	$fs.writeFileSync(`.Build/tmp/${theme}.scss`, scss, 'utf-8')

	let sass = ChildProcess.spawnSync(sassCmd, ['--stdin', `Viewer/themes/${theme}/${theme}.css`, '--no-source-map'], {
		input: scss
	})

	if (sass.error) {
		throw new Error(sass.error)
	}

	process.stdout.write(sass.status+'\n')
	if (sass.status == 65) {
		log($fs.readFileSync(`Viewer/themes/${theme}/${theme}.css`, 'utf-8'))
	} else if (sass.status != 0) {
		log(sass.stdout.toString())
	}
})
