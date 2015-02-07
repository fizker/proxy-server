require('es6-shim')
require('promise-helpers')
require('6to5/register')

global.chai = require('chai')
global.expect = chai.expect
chai.should()

global.fzkes = require('fzkes')
chai.use(fzkes)
