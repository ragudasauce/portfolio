// import { defineConfig, loadEnv } from 'vite'

// export default defineConfig(({ command, mode }) => {
//     // Load env file based on `mode` in the current working directory.
//     // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
//     const env = loadEnv(mode, process.cwd(), '')
//     return {
//         // vite config
//         define: {
//             __APP_ENV__: JSON.stringify(env.APP_ENV),
//         },
//     }
// })

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
            formats: ['es']
        },
        rollupOptions: {
            input: Object.fromEntries(
                globSync('src/web/**/*.mjs').map(file => [
                    // This remove `src/` as well as the file extension from each
                    // file, so e.g. src/nested/foo.js becomes nested/foo
                    path.relative(
                        'src',
                        file.slice(0, file.length - path.extname(file).length)
                    ),
                    // This expands the relative paths to absolute paths, so e.g.
                    // src/nested/foo becomes /project/src/nested/foo.js
                    fileURLToPath(new URL(file, import.meta.url))
                ])
            ),
            output: {
                dir: 'lib',
                format: 'esm',
                entryFileNames: '[name].mjs'
            }
        }
    }
  }