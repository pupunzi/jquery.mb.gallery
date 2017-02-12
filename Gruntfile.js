/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: Gruntfile.js                                                                                                                               _
 _ last modified: 24/05/15 20.15                                                                                                                    _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matteo@open-lab.com                                                                                                                       _
 _ site: http://pupunzi.com                                                                                                                         _
 _       http://open-lab.com                                                                                                                        _
 _ blog: http://pupunzi.open-lab.com                                                                                                                _
 _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
 _                                                                                                                                                  _
 _ Licences: MIT, GPL                                                                                                                               _
 _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
 _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
 _                                                                                                                                                  _
 _ Copyright (c) 2001-2015. Matteo Bicocchi (Pupunzi);                                                                                              _
 ___________________________________________________________________________________________________________________________________________________*/

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			dist: {
				files: [
					{flatten: true, expand: true, cwd: '../jquery.mb.browser/inc/', src: ['jquery.mb.browser.min.js'], dest: 'src/dep/'},
					{flatten: true, expand: true, cwd: '../jquery.mb.CSSAnimate/inc/', src: ['jquery.mb.CSSAnimate.min.js'], dest: 'src/dep/'},
					{flatten: false, expand: true, cwd: 'src/css/font/', src: ['**'],  dest: 'dist/css/font/'},
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
						' _ email: matteo@open-lab.com \n' +
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

		imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [{ removeViewBox: false }]
				},
				files: [{
					expand: true,
					cwd: '/src/assets/HR/',
					src: ['*.{png,jpg,gif}'],
					dest: '/dist/img/HR'
				},{
					expand: true,
					cwd: '/src/assets/LR/',
					src: ['*.{png,jpg,gif}'],
					dest: '/dist/img/LR'
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
					indentChar         : "\t",
					indentScripts      : "keep",
					indentSize         : 4,
					maxPreserveNewlines: 3,
					preserveNewlines   : true,
					spaceInParen       : true,
					unformatted        : ["a", "sub", "sup", "b", "i", "u"],
					wrapLineLength     : 0
				},
				css : {
					indentChar         : "\t",
					maxPreserveNewlines: 1,
					preserveNewlines   : false,
					indentSize         : 4
				},
				js  : {
					braceStyle             : "collapse",
					breakChainedMethods    : false,
					e4x                    : false,
					evalCode               : false,
					indentChar             : "\t",
					indentLevel            : 0,
					indentSize             : 4,
					indentWithTabs         : true,
					jslintHappy            : false,
					keepArrayIndentation   : false,
					keepFunctionIndentation: false,
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
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks('grunt-build-number');

	grunt.registerTask('default', ['buildnumber', 'copy','concat', 'uglify', 'cssmin', 'includereplace','imagemin', 'jsbeautifier']); //, 'imagemin'
};
