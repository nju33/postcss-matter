import fs from 'fs';
import test from 'ava';
import postcss from 'postcss';
import beautify from 'cssbeautify';
import matter from '..';

const css = fs.readFileSync('../examples/sample.css', 'utf-8');

function transform(opts = {}) {
  return new Promise(resolve => {
    postcss([matter(opts)])
      .process(css)
      .then(result => resolve(result.css));
  });
}

test('isolateLength is 3', async t => {
  const result = await transform();
  const expect = fs.readFileSync('./isolate-length-is-3.css', 'utf-8');
  t.is(beautify(result, {indent: '  '}), expect);
});

test('isolateLength is 2', async t => {
  const result = await transform({isolateLength: 2});
  const expect = fs.readFileSync('./isolate-length-is-2.css', 'utf-8');
  t.is(beautify(result, {indent: '  '}), expect);
});
