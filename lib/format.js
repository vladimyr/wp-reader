'use strict';

const html2text = require('html2plaintext');
const locale = require('os-locale').sync().replace('_', '-');

const dateFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

module.exports = {
  formatListItem,
  formatContent
};

function formatListItem(post, index) {
  return [
    (index + 1).toString().padStart(4, ' '),
    dateFormatter.format(new Date(post.createdAt)),
    `{yellow-fg}{bold}${post.title}{/}`
  ].join('\t');
}

function formatContent(post) {
  return `${formatTitle(post)}\n\n${formatBody(post)}`;
}

function formatTitle({ title }) {
  return `{yellow-fg}{bold}${html2text(title)}{/}`;
}

function formatBody({ content }) {
  return html2text(content);
}
