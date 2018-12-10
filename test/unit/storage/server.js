var storage = require('../../../src/storage/server')

var fs = require('fs').promises
var deepCopy = require('fmerge')

describe('unit/storage/server.js', function() {
	beforeEach(function() {
		this.proxies = [
			{ url: 'abc', localPort: 1, remotePort: 11 },
			{ url: 'abc', localPort: 2, remotePort: 22 },
		]
		storage.clearData()

		fzkes.fake(fs, 'readFile')
			.returns(Promise.resolve(JSON.stringify({
				url: 'abc',
				proxies: this.proxies,
			})))
		fzkes.fake(fs, 'writeFile')
			.calls((url, data, cb) => {
				this.lastWrittenData = JSON.parse(data)
				return Promise.resolve()
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
					{ url: 'abc', localPort: 2, remotePort: 22 },
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
					{ url: 'abc', localPort: 2, remotePort: 22 },
				],
			})
		})
	})

	describe('Calling `proxies.set()` with a new proxy', function() {
		beforeEach(function() {
			return storage.proxies.set({
				url: 'def',
				localPort: 3,
				remotePort: 33,
			})
		})
		it('should save with the new proxy', function() {
			expect(this.lastWrittenData).to.deep.equal({
				url: 'abc',
				proxies: [
					{ url: 'abc', localPort: 1, remotePort: 11 },
					{ url: 'abc', localPort: 2, remotePort: 22 },
					{ url: 'def', localPort: 3, remotePort: 33 },
				],
			})
		})

		describe('without a url', function() {
			beforeEach(function() {
				return storage.proxies.set({
					localPort: 4,
					remotePort: 44,
				})
			})
			it('should auto-add default url', function() {
				expect(this.lastWrittenData).to.deep.equal({
					url: 'abc',
					proxies: [
						{ url: 'abc', localPort: 1, remotePort: 11 },
						{ url: 'abc', localPort: 2, remotePort: 22 },
						{ url: 'def', localPort: 3, remotePort: 33 },
						{ url: 'abc', localPort: 4, remotePort: 44 },
					],
				})
			})
		})
	})
})
