'use strict';

const pWhilst = require('p-whilst');
const WordPressClient = require('wp-api-client');

module.exports = function fetchPosts(url, options, cb) {
  if (arguments.length === 2) {
    cb = options;
    options = {};
  }
  options.pageSize = options.pageSize || 25;
  let offset = 0;
  let end = false;
  const client = new WordPressClient(url);
  return pWhilst(() => !end, async () => {
    const { total, items = [] } = await client.fetchPosts({ ...options, offset });
    if (items.length <= 0) return (end = true);
    items.forEach((el, index) => cb(el, total - offset - index - 1));
    offset += options.pageSize;
  });
};
