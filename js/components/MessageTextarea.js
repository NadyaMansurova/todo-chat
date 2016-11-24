import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';

export default class MessageTextarea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };

  }

  componentWillMount() {
    const { editedPost } = this.props;

    if (editedPost && editedPost.text !== this.state.text) {
        this.setState({
          text: editedPost.text
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { editedPost } = nextProps;

    if (editedPost && editedPost.text !== this.state.text) {
        this.setState({
          text: editedPost.text
        });
    }
  }

  render() {
    const { addPost, editPost, editedPost } = this.props;

    const onKeyDown = (event) => {
        if (event.keyCode == 13) {
          if (!editedPost) {
            addPost(this.state.text);
          } else {
            editPost({
              id: editedPost.id,
              text: this.state.text
            });
          }
          this.setState({
            text: ''
          });
        }
      }
    return (
      <textarea className="message__textarea"
        onKeyDown={onKeyDown}
        onChange={event => this.onTextareaChange(event.target.value)}
        placeholder="Enter your message ..."
        value={this.state.text}>
      </textarea>
    );
  }

  onTextareaChange(text) {
    this.setState({
      text: text.replace(/\r?\n|\r/g, '')
    });
  }
}
