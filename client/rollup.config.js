import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import replace from "@rollup/plugin-replace";

const isDev = Boolean(process.env.ROLLUP_WATCH);
const production = !isDev;

function serve() {
    let server;

    function toExit() {
        console.log("~~~~ Shutting down dev server ~~~~");

        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) {
                console.log("~~~~ dev server up ~~~~");
                return;
            }

            console.log("~~~~ Starting dev server ~~~~");

            server = require("child_process").spawn(
                "npm",
                ["run", "start", "--", "--dev"],
                {
                    stdio: ["ignore", "inherit", "inherit"],
                    shell: true,
                }
            );

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        },
    };
}

export default {
    input: "src/main.ts",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "public/build/bundle.js",
    },
    plugins: [
        replace({
            preventAssignment: true,
            include: ["src/**/*.ts", "src/**/*.svelte"],
            values: {
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
                "process.env.API_HOST": JSON.stringify(
                    isDev ? "http://localhost:8000" : ""
                ),
            },
        }),
        svelte({
            preprocess: sveltePreprocess({
                postcss: {
                    plugins: [require("tailwindcss"), require("autoprefixer")],
                },
            }),
            compilerOptions: { dev: isDev },
        }),
        css({ output: "bundle.css", sourceMap: true }),
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),
        typescript({
            sourceMap: true,
            inlineSources: isDev,
            cacheDir: "node_modules/.tmp/.rollup.tscache",
        }),
        isDev && serve(),
        isDev && livereload({ watch: "public/build", delay: 250 }),
        production && terser(),
    ],
    watch: {
        clearScreen: true,
        buildDelay: 2500,
        exclude: ["node_modules/**", "*.go"],
    },
};
