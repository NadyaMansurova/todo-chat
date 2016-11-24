import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Post from '../js/components/Post';

it('Post render correct', () => {
  const edge = {
		node: {
			id: 'id_node',
			text: "initial post 2 text",
	    data: "2016-11-19T14:20:29+00:00"
		}
	};
	let postId = null;
	let postN = null;
	const counter = 2;
	const i = 2;
	const avatar = '1.jpg';
	const editPost = (node) => {
		postN = node;
	};

	const deletePost = (id) => {
		postId = id;
	};

  const post = TestUtils.renderIntoDocument(
    <Post edge={edge}
			key={edge.node.id}
			lastNode={counter - 1}
			number={i}
			avatar={avatar}
			editPost={editPost.bind(this, edge.node)}
			deletePost={deletePost.bind(this, edge.node.id)} />
  );

  const postNode = ReactDOM.findDOMNode(post);
  expect(postNode.getAttribute('class')).toEqual('message');

	const postNodeText = TestUtils.findRenderedDOMComponentWithClass(post, 'post__text');
	expect(postNodeText.textContent).toEqual('initial post 2 text');

	const postNodeDate = TestUtils.findRenderedDOMComponentWithClass(post, 'post__time');
	expect(postNodeDate.textContent).toEqual('19.11.2016 05:20:29');

	const editButton = TestUtils.findRenderedDOMComponentWithClass(post, 'btn__edit');
	const deleteButton = TestUtils.findRenderedDOMComponentWithClass(post, 'btn__delete');

	it('Post editPost works correct', () => {
		TestUtils.Simulate.click(editButton);
		expect(postNode).toEqual(edge.node);
	});

	it('Post deletePost works correct', () => {
		TestUtils.Simulate.click(deleteButton);
		expect(postId).toEqual('id_node');
	});
});
