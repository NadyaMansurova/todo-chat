import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import MessageTextarea from '../js/components/MessageTextarea';

it('MessageTextarea render correct', () => {
	let postId = null;
  const post = {
		id: '1',
		text: 'initial text'
	};
	const addPost = (node) => {	};
	const editPost = (id) => {
		postId = id;
	};

  const msgTextarea = TestUtils.renderIntoDocument(
		<MessageTextarea
			editPost={editPost}
			addPost={addPost}
			editedPost={post}/>
  );
	const msgNodeText = TestUtils.findRenderedDOMComponentWithClass(msgTextarea, 'message__textarea');
	expect(msgNodeText.textContent).toEqual('initial text');

  const msgNode = ReactDOM.findDOMNode(msgTextarea);
  expect(msgNode.getAttribute('class')).toEqual('message__textarea');

	it('MessageTextarea setState works correct', () => {
		msgTextarea.setState({
	      text: 'new post 2 text'
	    }, () => {
				expect(msgNodeText.textContent).toEqual('new post 2 text');
	  });
	});

	it('MessageTextarea editPost works correct', () => {
		TestUtils.Simulate.keyDown(msgNode, {keyCode : 13});
		expect(postId).toEqual('1');
	});

});
