let cssFile = $path.resolve('./material-icons/iconfont/material-icons.css')
let css = $fs.readFileSync(cssFile, 'utf-8')
let fonts = css.match(/\@font-face.+?\{.+?\}/sg)
fonts.forEach(font => {
	let src = font.match(/src:.+url\(('|")(.+?)('|")\);/)
	src[0].split(':')[1].split(',').forEach(_src => {
		if (_src.match(/format\(('|")(.+?)('|")\)/)[2] == 'woff2') {
			let url = _src.match(/url\(('|")(.+?)('|")\)/)[2]
			log(url)
			let data = $fs.readFileSync($path.join($path.dirname(cssFile), url))
			css = css.replace(src[0], `src: url(data:application/x-font-woff;charset=utf-8;base64,${data.toString('base64')});`)
		}
	})
})

$fs.writeFileSync('src/css/material-icons.css', css, 'utf-8')




