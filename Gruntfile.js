module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        app: {
            dist: '_site',
            deploy: {
                user: process.env.BERRIART_DEPLOY_USER
            }
        },

        clean: {
            build: ['js', '_site']
        },

        uglify: {
            dist: {
                files: {
                    'js/app.js': [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/what-input/what-input.js',
                        'node_modules/foundation-sites/js/foundation.core.js',
                        'node_modules/foundation-sites/js/foundation.util.mediaQuery.js',
                        'node_modules/foundation-sites/js/foundation.util.keyboard.js',
                        'node_modules/foundation-sites/js/foundation.util.box.js',
                        'node_modules/foundation-sites/js/foundation.util.triggers.js',
                        'node_modules/foundation-sites/js/foundation.util.motion.js',
                        'node_modules/foundation-sites/js/foundation.reveal.js',
                        'node_modules/foundation-sites/js/foundation.sticky.js',
                        'javascript/app.js',
                        'node_modules/cookieconsent/src/cookieconsent.js'
                    ],
                    'js/sidr.js': [
                        'node_modules/jquery-touchswipe/jquery.touchSwipe.js',
                        'node_modules/sidr/dist/jquery.sidr.js',
                        'javascript/sidr.js'
                    ]
                }
            },
            watch: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    compress: false,
                    mangle: false
                },
                files: {
                    'js/app.js': [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/what-input/what-input.js',
                        'node_modules/foundation-sites/js/foundation.core.js',
                        'node_modules/foundation-sites/js/foundation.util.mediaQuery.js',
                        'node_modules/foundation-sites/js/foundation.util.keyboard.js',
                        'node_modules/foundation-sites/js/foundation.util.box.js',
                        'node_modules/foundation-sites/js/foundation.util.triggers.js',
                        'node_modules/foundation-sites/js/foundation.util.motion.js',
                        'node_modules/foundation-sites/js/foundation.reveal.js',
                        'node_modules/foundation-sites/js/foundation.sticky.js',
                        'javascript/app.js',
                        'node_modules/cookieconsent/src/cookieconsent.js'
                    ],
                    'js/sidr.js': [
                        'node_modules/jquery-touchswipe/jquery.touchSwipe.js',
                        'node_modules/sidr/dist/jquery.sidr.js',
                        'javascript/sidr.js'
                    ]
                }
            }
        },

        jekyll: {
            options: {
                bundleExec: true,
                src: './'
            },
            watch: {
                options: {
                    dest: '<%= app.dist %>',
                    config: '_config.yml',
                    incremental: true
                }
            },
            dist: {
                options: {
                    dest: '<%= app.dist %>',
                    config: '_config.yml'
                }
            }
        },

        watch: {
            jekyll: {
                files: [
                    '*.{html,xml,php}',
                    '.html',
                    '_*/**/*.{html,md,mkd,markdown,scss}',
                    'projects/**/*.{html,md,mkd,markdown}',
                    'blog/**/*.{html,md,mkd,markdown}',
                    'contact/**/*.{html,md,mkd,markdown}',
                    'css/*',
                    'js/*',
                    'images/*'
                ],
                tasks: ['jekyll:watch']
            },
            javascript: {
                files: ['javascript/*.js'],
                tasks: ['uglify:watch']
            }
        },

        connect: {
            server: {
                options: {
                    port: 4000,
                    base: '_site'
                }
            }
        },

        environments: {
            options: {
                local_path: '_site',
                current_symlink: 'current',
                deploy_path: '/data/www/berriart.com'
            },
            production: {
                options: {
                    host: '52.208.104.124',
                    username: '<%= app.deploy.user %>',
                    privateKey: require('fs').readFileSync(process.env.BERRIART_DEPLOY_KEY),
                    port: '22',
                    releases_to_keep: '5'
                }
            }
        },

        scsslint: {
            allFiles: [
                'css/main.scss',
                '_sass/_*.scss',
                '!_sass/_syntax-highlighting.scss'
            ],
            options: {
                bundleExec: true,
                config: '.scss-lint.yml',
                colorizeOutput: true
            }
        },

        eslint: {
            options: {
                configFile: 'eslint.json'
            },
            target: ['javascript/app.js']
        }
    });

    grunt.registerTask('serve', ['connect', 'watch']);
    grunt.registerTask('build', ['clean', 'uglify:dist']);

    grunt.registerTask('lint', ['scsslint', 'eslint']);

    grunt.registerTask('all', ['lint', 'build']);

    grunt.registerTask('default', ['serve']);

    grunt.registerTask('deploy', [
        'ssh_deploy:production'
    ]);
};
