module.exports = {
	apps: [
		{
			name: 'cordless_bot',
			script: './dist/index.js',
			watch: true,
			env: {
				IN_PM2: true,
			},
		},
	],
};
