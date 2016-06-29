const fs = require('fs');
const postcss = require('postcss');
const beautify = require('cssbeautify');
const matter = require('..');

const css = fs.readFileSync('./sample.css', 'utf-8');

postcss([matter])
  .process(css)
  .then(result => console.log(beautify(result.css, {indent: '  '})));
