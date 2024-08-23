import gulp from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import fonter from 'gulp-fonter-fix';
import ttf2woff2 from 'gulp-ttf2woff2';
import fs from 'fs'; // Import fs module

export const otfToTtf = () => {
	return gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
		.pipe(plumber({
			errorHandler: notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			})
		}))
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(gulp.dest(`${app.path.srcFolder}/fonts/`));
}

export const ttfToWoff = (done) => {
	if (!fs.existsSync(`${app.path.srcFolder}/fonts`)) { // Use fs.existsSync
		console.log('No fonts directory found.');
		done();
		return;
	}

	return gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
		.pipe(plumber({
			errorHandler: notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			})
		}))
		.pipe(fonter({ formats: ['woff'] }))
		.pipe(gulp.dest(`${app.path.build.fonts}`))
		.pipe(gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
		.pipe(ttf2woff2())
		.pipe(gulp.dest(`${app.path.build.fonts}`))
		.on('end', done)
		.on('error', (err) => {
			console.error('Error:', err);
			done(err);
		});
}

export const fonstStyle = () => {
	let fontsFile = `${app.path.srcFolder}/scss/fonts/fonts.scss`;
	app.isFontsReW ? fs.unlink(fontsFile, cb) : null;
	fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
		if (fontsFiles) {
			if (!fs.existsSync(fontsFile)) {
				fs.writeFile(fontsFile, '', cb);
				let newFileOnly;
				for (var i = 0; i < fontsFiles.length; i++) {
					let fontFileName = fontsFiles[i].split('.')[0];
					if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
						let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
						if (fontWeight.toLowerCase() === 'thin') {
							fontWeight = 100;
						} else if (fontWeight.toLowerCase() === 'extralight') {
							fontWeight = 200;
						} else if (fontWeight.toLowerCase() === 'light') {
							fontWeight = 300;
						} else if (fontWeight.toLowerCase() === 'medium') {
							fontWeight = 500;
						} else if (fontWeight.toLowerCase() === 'semibold') {
							fontWeight = 600;
						} else if (fontWeight.toLowerCase() === 'bold') {
							fontWeight = 700;
						} else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
							fontWeight = 800;
						} else if (fontWeight.toLowerCase() === 'black') {
							fontWeight = 900;
						} else {
							fontWeight = 400;
						}
						fs.appendFile(fontsFile, `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
						newFileOnly = fontFileName;
					}
				}
			} else {
				console.log("Файл scss/fonts/fonts.scss уже существует. Для обновления файла нужно его удалить!");
			}
		} else {
			fs.unlink(fontsFile, cb);
		}
	});
	return gulp.src(`${app.path.srcFolder}`);
}

function cb() { }
