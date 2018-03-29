module.exports = {
	sourceMaps: true,
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					stream: 'stream-browserify',
					process: 'process/browser.js',
					randombytes: require.resolve('./randombytes.js'),
					crypto: 'crypto-browserify',
					zlib: 'zlib-browserify',
					vm: "vm-browserify",
				},
			},
		],
	],
};
