import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('vite').UserConfig} */
export default {
    cacheDir: './cache/.vite',
    build: {
        sourcemap: true,
        minify: false,
        lib: {
            entry: './src/web/index.mjs',
            name: 'sdk',
            formats: ['es'],
        },
        rollupOptions: {
            input: Object.fromEntries(
                globSync('src/web/**/*.mjs', {
                    ignore: 'src/web/**/*.test.mjs',
                }).map((file) => [
                    path.relative(
                        'src',
                        file.slice(0, file.length - path.extname(file).length)
                    ),

                    fileURLToPath(new URL(file, import.meta.url)),
                ])
            ),
            output: {
                dir: 'lib',
                entryFileNames: '[name].mjs',
            },
        },
    },
};
