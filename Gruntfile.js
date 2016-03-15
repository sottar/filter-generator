module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.registerTask("default", ["connect", "watch", "typescript", "compass", "autoprefixer"]);
  grunt.initConfig({
    connect: {
      livereload: {
        options: {
          port: 9001
        }
      }
    },
    compass: {
      compile: {
        options: {
          config: 'config.rb'
        }
      }
    },
    typescript: {
      base: {
        src: ['src/typescript/script.ts'],
        dest: 'src/javascript/script.js'
      }
    },
    watch: {
      css: {
        files: ['src/stylesheets/style.css']
      },
      scss: {
        files: ['src/sass/*.scss'],
        tasks: ['compass', 'autoprefixer']
      },
      ts: {
        files: ['src/typescript/*.ts'],
        tasks: ['typescript']
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 8']
      },
      dist: {
        src: ['src/stylesheets/*.css'],
      }
    }
  });
};
