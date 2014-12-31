var at = require('../../index')
    , uglify = require('gulp-uglify')
    , chai = require('chai')
    , expect = chai.expect
    ;

describe('validation', function(){

    describe('of config object', function () {

        it('should raise an Error if no configuration is provided', function () {

            expect(at.bind(null)).to.throw('value is required');
        });

        it('should raise an Error if it contains an invalid block configuration', function () {

            var config = {
                js: 'not a block config'
            };

            expect(at.bind(null, config)).to.throw('js must be an object');
        });

        it('should not raise any errors if it contains a tagTemplates property', function () {

            var config = {
                tagTemplates: {
                    js: function () {}
                }
            };

            expect(at.bind(null, config)).to.not.throw();
        });

        it('should raise an Error if tasks is defined and is not an array', function () {

            var config = {
                js: {
                    tasks: 'not an array'
                }
            };

            expect(at.bind(null, config)).to.throw('tasks must be an array');
        });

        it('should raise an Error if tasks contains an invalid task', function () {

            var config = {
                js: {
                    tasks: [function () {}, 'concat', uglify(), 123]
                },
                css: {
                    tasks: ['concat']
                }
            };

            expect(at.bind(null, config)).to.throw('tasks at position 3 does not match any of the allowed types');
        });

        it('should raise an Error if stream is defined and is not an array', function () {

            var config = {
                js: {
                    stream: 'not a function'
                }
            };

            expect(at.bind(null, config)).to.throw('stream must be a Function');
        });

        it('should raise an Error if neither tasks nor stream were defined', function () {

            var config = {
                js: {}
            };

            expect(at.bind(null, config)).to.throw('value must contain at least one of tasks, stream');
        });

        it('should raise an Error if both tasks and stream were defined', function () {

            var config = {
                js: {
                    tasks: ['concat'],
                    stream: function () {}
                }
            };

            expect(at.bind(null, config)).to.throw('value contains a conflict between exclusive peers tasks, stream');
        });

        it('should raise an Error if tag is defined and is not a string', function () {

            var config = {
                js: {
                    tasks: ['concat'],
                    tag: function () {}
                }
            };

            expect(at.bind(null, config)).to.throw('tag must be a string');
        });

        it('should raise an Error if tagTemplate is defined and is not a function', function () {

            var config = {
                js: {
                    tasks: ['concat'],
                    tagTemplate: 'not a function'
                }
            };

            expect(at.bind(null, config)).to.throw('tagTemplate must be a Function');
        });

        it('should not raise any errors for a valid config', function () {

            var config = {
                js: {
                    tasks: [uglify(), 'concat'],
                    tag: '<script type="text/javascript">'
                },
                css: {
                    stream: function () {},
                    tagTemplate: function () {}
                }
            };

            expect(at.bind(null, config)).to.not.throw();
        });

    });

    describe('of opts object', function () {

        it('should raise an Error if tagTemplates is defined and is not an object', function () {

            var opts = {
                tagTemplates: 'not an object'
            };

            expect(at.bind(null, {}, opts)).to.throw('tagTemplates must be an object');
        });

        it('should raise an Error if tagTemplates contains an invalid tag template', function () {

            var opts = {
                tagTemplates: {
                    js: function () {},
                    css: 'not a function'
                }
            };

            expect(at.bind(null, {}, opts)).to.throw('css must be a Function');
        });

        it('should raise an Error if regExps is defined and is not an object', function () {

            var opts = {
                regExps: 'not an object'
            };

            expect(at.bind(null, {}, opts)).to.throw('regExps must be an object');
        });

        it('should raise an Error if regExps.start is defined and is not a RegExp', function () {

            var opts = {
                regExps: {
                    start: {},
                    end: /^/
                }
            };

            expect(at.bind(null, {}, opts)).to.throw('start must be an instance of RegExp');
        });

        it('should raise an Error if regExps.end is defined and is not a RegExp', function () {

            var opts = {
                regExps: {
                    start: /^/,
                    end: {}
                }
            };

            expect(at.bind(null, {}, opts)).to.throw('end must be an instance of RegExp');
        });

        it('should not raise any errors for a valid opts object', function () {

            var config = {
                js: {
                    tasks: [uglify(), 'concat'],
                    tag: '<script type="text/javascript">'
                },
                css: {
                    stream: function () {},
                    tagTemplate: function () {}
                }
            };

            var opts = {
                tagTemplates: {
                    js: function () {},
                    css: function () {}
                },
                regExps: {
                    start: /^/,
                    end: /^/
                }
            };

            expect(at.bind(null, config, opts)).to.not.throw();
        });
    });

});