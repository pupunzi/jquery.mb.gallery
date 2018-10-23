/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 jquery.mb.components

 file: Gruntfile.js
 last modified: 25/11/17 19.13
 Version:  {{ version }}
 Build:  {{ buildnum }}

 Open Lab s.r.l., Florence - Italy
 email:  matbicoc@gmail.com
 blog: 	http://pupunzi.open-lab.com
 site: 	http://pupunzi.com
 	http://open-lab.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html

 Copyright (c) 2001-2017. Matteo Bicocchi (Pupunzi)
 :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			dist: {
				files: [
					{flatten: true, expand: true, cwd: '../jquery.mb.browser/inc/', src: ['jquery.mb.browser.min.js'], dest: 'src/dep/'},
					{flatten: true, expand: true, cwd: '../jquery.mb.CSSAnimate/inc/', src: ['jquery.mb.CSSAnimate.min.js'], dest: 'src/dep/'},
					{flatten: false, expand: true, cwd: 'src/css/font/', src: ['**'],  dest: 'dist/css/font/'},
//					{flatten: false, expand: true, cwd: 'src/img/', src: ['**'],  dest: 'dist/img/'},
					{flatten: true, expand: true, cwd: 'src/', src: ['index.tmpl'], dest: 'dist/',
						rename: function(dest, src) {
							return dest + src.replace('.tmpl','.html');
						}}
				]
			}
		},

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [ 'src/*.js','src/dep/*.js'],
				dest: 'dist/<%= pkg.title %>.js'
			}
		},

		uglify: {
			options: {
				banner: '/*' +
						' <%= pkg.title %> <%= grunt.template.today("dd-mm-yyyy") %>\n' +
						' _ jquery.mb.components \n' +
						' _ email: matbicoc@gmail.com \n' +
						' _ Copyright (c) 2001-<%= grunt.template.today("yyyy") %>. Matteo Bicocchi (Pupunzi); \n' +
						' _ blog: http://pupunzi.open-lab.com  \n' +
						' _ Open Lab s.r.l., Florence - Italy \n' +
						' */\n'
			},

			dist: {
				files: {
					'dist/<%= pkg.title %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},

		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			dist: {
				files: {
					'dist/css/<%= pkg.name %>.min.css': ['src/css/*.css']
				}
			}
		},

		includereplace: {
			dist: {
				options: {
					prefix: '{{ ',
					suffix: ' }}',
					globals: {
						version: '<%= pkg.version %>',
						build: '<%= grunt.file.readJSON("package.json").buildnum %>'
					}
				},
				files: [
					{src: 'dist/*.js', expand: true},
					{src: 'dist/*.html', expand: true},
					{src: 'dist/css/*.css', expand: true}
				]
			}
		},

		image: {
			dynamic: {
				options: {
					optipng: false,
					pngquant: false,
					zopflipng: false,
					jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
					mozjpeg: false,
					guetzli: false,
					gifsicle: false,
					svgo: false
				},
				files: [{
					expand: true,
					cwd: 'src/assets/HR',
					src: ['*.{png,jpg,gif}'],
					dest: 'dist/img/HR'
				},{
					expand: true,
					cwd: 'src/assets/LR',
					src: ['*.{png,jpg,gif}'],
					dest: 'dist/img/LR'
				}
				]
			}
		},

		buildnumber: {
			options: {
				field: 'buildnum'
			},
			files  : ['package.json', 'bower.json']
		},

		watch: {
			files: ['src/css/*.css','src/*.js','src/*.tmpl', 'Gruntfile.js'],
			tasks: ['default']
		},

		jsbeautifier: {
			files  : ['src/*.js', '!dist/*.min.js', 'src/*.html', 'src/*.tmpl', 'src/css/*.css'],
			options: {
				html: {
					braceStyle         : "collapse",
					indentChar         : " ",
					indentScripts      : "keep",
					indentSize         : 4,
					maxPreserveNewlines: 3,
					preserveNewlines   : true,
					spaceInParen       : true,
					unformatted        : ["a", "sub", "sup", "b", "i", "u"],
					wrapLineLength     : 0
				},
				css : {
					indentChar         : " ",
					maxPreserveNewlines: 1,
					preserveNewlines   : false,
					indentSize         : 4
				},
				js  : {
					braceStyle             : "collapse",
					breakChainedMethods    : false,
					e4x                    : false,
					evalCode               : false,
					indentChar             : " ",
					indentLevel            : 0,
					indentSize             : 4,
					indentWithTabs         : true,
					jslintHappy            : false,
					keepArrayIndentation   : true,
					keepFunctionIndentation: true,
					maxPreserveNewlines    : 0,
					preserveNewlines       : true,
					spaceBeforeConditional : true,
					spaceInParen           : true,
					spaceInEmptyParen      : true,
					commaFirst             : false,
					unescapeStrings        : false,
					wrapLineLength         : 0,
					endWithNewline         : false
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks('grunt-build-number');
	grunt.loadNpmTasks('grunt-image');

	grunt.registerTask('default', ['buildnumber', 'copy','concat', 'uglify', 'cssmin', 'includereplace', 'jsbeautifier']); //, 'image'
};
