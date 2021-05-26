// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default {
    input: 'src/main.js',
    output: {
        name:'reactem',
        file: pkg.main,
        format: 'umd'
    },
    plugins: [
        resolve(),
        commonjs(),
        terser()
    ]
}
