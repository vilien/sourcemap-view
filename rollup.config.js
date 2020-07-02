import typescript from 'rollup-plugin-typescript';

const pkg = require('./package.json');

export default {
	input: 'src/sourcemap-view.ts',
	output: [{
		file: pkg.main,
		format: 'umd',
		name: 'sourcemapView'
	}, {
		file: pkg.module,
		format: 'es'
	}],
	plugins: [
		typescript({
			exclude: 'node_modules/**',
			typescript: require('typescript')
		})
	]
};