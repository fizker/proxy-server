var storage = require('../../../src/storage/server')

var fs = require('fs')
var deepCopy = require('fmerge')

describe('unit/storage/server.js', function() {
	beforeEach(function() {
		this.proxies = [
			{ localPort: 1, remotePort: 11 },
			{ localPort: 2, remotePort: 22 },
		]
		storage.clearData()

		fzkes.fake(fs, 'readFile')
			.callsArg({ arguments: [ null, JSON.stringify({
				url: 'abc',
				proxies: this.proxies,
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

	describe('Calling `proxies.delete()` with a proxy object', function() {
		beforeEach(function() {
			var proxy = deepCopy(this.proxies[0])
			this.promise = storage.proxies.delete(proxy)
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
