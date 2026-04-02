/**
 * Minify CSS: strip comments, merge rules, shortest output.
 * Usage: node scripts/minify-css.js <input.css> [output.css]
 *        npm run minify-css -- site/assets/css/custom.css site/assets/css/custom.min.css
 * Default output: <basename>.min.css next to the input file.
 */

const fs = require("fs");
const path = require("path");
const { minify } = require("csso");

const input = process.argv[2];
const outputArg = process.argv[3];

if (!input) {
  console.error(
    "Usage: node scripts/minify-css.js <input.css> [output.css]\n" +
      "Example: node scripts/minify-css.js site/assets/css/search_form.css"
  );
  process.exit(1);
}

const absIn = path.resolve(input);
if (!fs.existsSync(absIn)) {
  console.error("File not found:", absIn);
  process.exit(1);
}

const source = fs.readFileSync(absIn, "utf8");
const { css } = minify(source, {
  filename: path.basename(absIn),
  sourceMap: false,
  restructure: true,
  comments: false,
});

const absOut = outputArg
  ? path.resolve(outputArg)
  : path.join(
      path.dirname(absIn),
      `${path.basename(absIn, path.extname(absIn))}.min.css`
    );

fs.mkdirSync(path.dirname(absOut), { recursive: true });
fs.writeFileSync(absOut, css, "utf8");

const inBytes = Buffer.byteLength(source, "utf8");
const outBytes = Buffer.byteLength(css, "utf8");
const ratio = inBytes ? ((1 - outBytes / inBytes) * 100).toFixed(1) : "0";

console.log(`${absIn} → ${absOut}`);
console.log(`${inBytes} → ${outBytes} bytes (${ratio}% smaller)`);
