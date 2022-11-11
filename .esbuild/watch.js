#!/usr/bin/env node

import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import purgecss from "@fullhuman/postcss-purgecss";

esbuild
  .build({
    entryPoints: [
      `src/build/${process.env.POET_PROJECT}/theme/static/theme/css/index.scss`,
      `src/build/${process.env.POET_PROJECT}/theme/static/theme/js/index.js`,
    ],
    outdir: "src",
    outbase: "src/build",
    bundle: true,
    metafile: true,
    minify: false,
    plugins: [
      sassPlugin({
        async transform(source) {
          const { css } = await postcss([
            purgecss({
              content: [
                `src/${process.env.POET_PROJECT}/theme/templates/**/*html`,
              ],
            }),
            autoprefixer,
          ]).process(source, {
            from: undefined,
          });
          return css;
        },
        loadPaths: ["node_modules/vertical-rhythm-reset/dist"],
      }),
    ],
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("⚡ Build complete! ⚡", result);
      },
    },
  })
  .then((result) => console.log("⚡ Watching oy! ⚡"))
  .catch(() => process.exit(1));
