let ChildProcess = require('child_process')
let sassCmd = $path.join($path.dirname(process.argv[0]), 'sass.cmd')

let theme = process.argv.length > 2 ? process.argv[2] : 'tts'
GenerateThemeScss(theme)
SpawnBuild(theme)

function GenerateThemeScss (theme) {
let scss = `
@import '_variables.scss';
@import 'themes/${theme}/_variables.scss';
@import '../../node_modules/bootstrap/scss/bootstrap.scss';
@import 'themes/${theme}/custom.scss';
@import 'custom.scss';
`
$fs.writeFileSync(`./src/scss/${theme}.scss`, scss, 'utf-8')
}

function SpawnBuild (theme) {
	let sass = ChildProcess.spawnSync(sassCmd, [`src/scss/${theme}.scss`, `src/bootstrap.${theme}.css`, '--no-source-map'])
	if (sass.error) {
		throw new Error(sass.error)
	}
}

