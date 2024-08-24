import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        files: './src/test.js'
    },
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
];

