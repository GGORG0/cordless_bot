module.exports = {
	apps: [
		{
			name: 'cordless_bot',
			script: './src/index.ts',
			watch:true,
			env: {
				IN_PM2: true,
			},
		},
	],
};
