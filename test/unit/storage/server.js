var storage = require('../../../src/storage/server')

var fs = require('fs')

describe('unit/storage/server.js', function() {
	beforeEach(function() {
		fzkes.fake(fs, 'readFile')
			.callsArg({ arguments: [ null, JSON.stringify({
				url: 'abc',
				proxies: [
					{ localPort: 1, remotePort: 11 },
					{ localPort: 2, remotePort: 22 },
				],
			}) ] })
		fzkes.fake(fs, 'writeFile')
			.calls((url, data, cb) => {
				this.lastWrittenData = JSON.parse(data)
				cb()
			})
	})

	describe('Calling `proxies.delete()` with only a port', function() {
		beforeEach(function() {
			this.promise = storage.proxies.delete(1)
			return this.promise
		})
		it('should remove that proxy', function() {
			expect(this.lastWrittenData).to.deep.equal({
				url: 'abc',
				proxies: [
					{ localPort: 2, remotePort: 22 },
				],
			})
		})
	})
})
