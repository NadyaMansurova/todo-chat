import moment from 'moment';

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class User {}
class Widget {}
class Post {}

// Mock data
const viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
viewer.avatar = '1.jpg';
const widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.name = name;
  widget.id = `${i}`;
  return widget;
});
let nextPostId = 0;

const posts = [
  {
    text: "initial post text",
    data: "2016-11-18T19:20:29+00:00"
  },
  {
    text: "initial post 2 text",
    data: "2016-11-19T14:20:29+00:00"
  }
].map((item, i) => {
  var post = new Post();
  post.text = item.text;
  post.data = item.data;
  post.id = `${nextPostId++}`;
  return post;
});

const getPost = (id) => {
  posts.map((item) => {
    if (item.id === id) {
      return item;
    }
  });
}

module.exports = {
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  getPosts: () => posts,
  getPost: getPost,
  editPost: (id, text) => {
    posts.map((item, i) => {
      if (item.id === id) {
        item.text = text;
      }
    });
  },
  deletePost: (id) => {
    posts.map((item, i) => {
      if (item.id === id) {
        posts.splice(i, 1);
      }
    });
  },
  addPost: (text) => {
    const post = new Post();
    post.text = text;
    post.data = moment().toISOString();
    post.id = `${nextPostId++}`;
    posts.push(post);
    return post.id;
  },
  User,
  Widget,
  Post
};
