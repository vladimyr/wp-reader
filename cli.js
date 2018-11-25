#!/usr/bin/env node

'use strict';

const { Box, List, Screen } = require('neo-blessed').widget;
const { formatListItem, formatContent } = require('./lib/format');
const argv = require('minimist')(process.argv.slice(2));
const fetchPosts = require('./lib/fetch-posts');
const withPager = require('./lib/pager');
const Window = require('./lib/window');

const posts = [];
const [url] = argv._;

const shortcuts = {
  pageup: ['b', 'C-b', 'pageup'],
  pagedown: ['f', 'C-f', 'pagedown']
};

const fillParent = {
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
};

const screen = new Screen({ smartCSR: true, terminal: process.env.TERM });
screen.key(['q', 'C-c'], () => process.exit(0));

const postList = new (withPager(List, shortcuts))({
  ...fillParent,
  keys: true,
  tags: true,
  style: {
    bg: 'black',
    fg: 'white',
    selected: {
      bg: 'cyan',
      fg: 'white'
    }
  }
});

const content = new (withPager(Box, shortcuts))({
  ...fillParent,
  hidden: true,
  keys: true,
  tags: true,
  alwaysScroll: true,
  scrollbar: true,
  style: {
    bg: 'black',
    fg: 'white'
  }
});

const reader = new Window(postList, content, fillParent);
reader.contentView.key(['backspace', 'escape'], () => reader.closeContentView());
reader.setContentCallback(index => formatContent(posts[index]));

screen.append(reader);
screen.render();

fetchPosts(url, (post, index) => {
  posts.push(post);
  reader.listView.addItem(formatListItem(post, index));
  screen.render();
});
