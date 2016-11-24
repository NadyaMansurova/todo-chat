import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import Post from './Post';
import MessageTextarea from './MessageTextarea';

import AddPostMutation from '../../mutations/AddPostMutation';
import EditPostMutation from '../../mutations/EditPostMutation';
import DeletePostMutation from '../../mutations/DeletePostMutation';

require("!style!css!sass!./app.scss");

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      post: null
    };
    const {edges} = props.viewer.posts;
    this._handlePostEdit = this._handlePostEdit.bind(this);
    this._handlePostDelete = this._handlePostEdit.bind(this);
    this._handlePostAdd = this._handlePostAdd.bind(this);
  }

  render() {
    const counter = this.props.viewer.posts.edges.length;
    const avatar = this.props.viewer.avatar;

    const editPost = (post) => {
      this.setState({
        post: post
      });
    }
    let label = 'items';
    if (counter < 2) {
      label = 'item';
    }


    return (
      <div className="chat__container">
        <div className="counter__container">
          <div className="counter">{counter} {label}</div>
        </div>
        <div className="messages__container">
          <ul className="messages__ul">
            {
              this.props.viewer.posts.edges.map((edge, i) => {
                return <Post edge={edge}
                  key={edge.node.id}
                  lastNode={counter - 1}
                  number={i}
                  avatar={avatar}
                  editPost={editPost.bind(this, edge.node)}
                  deletePost={this._handlePostDestroy.bind(this, edge.node.id)} />;
              })
            }
          </ul>
        </div>
        <div className="message__container">
          <MessageTextarea
            editPost={this._handlePostEdit}
            addPost={this._handlePostAdd}
            editedPost={this.state.post}/>
        </div>
      </div>
    );
  }
  _handlePostAdd(text) {
     this.props.relay.commitUpdate(
       new AddPostMutation({
         text,
         viewer: this.props.viewer
       })
     );
  }
  _handlePostDestroy(id) {
    this.props.relay.commitUpdate(
      new DeletePostMutation({
        id,
        viewer: this.props.viewer,
      })
    );
  }
  _handlePostEdit(post) {
    this.setState({
      post: null
    });
    this.props.relay.commitUpdate(
      new EditPostMutation({
        post: post,
        viewer: this.props.viewer,
      })
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    numPostsToShow: 10000
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        avatar,
        posts(first: $numPostsToShow) {
          edges {
            node {
              id,
              data,
              text,
            },
          },
        },
        ${AddPostMutation.getFragment('viewer')},
        ${EditPostMutation.getFragment('viewer')},
        ${DeletePostMutation.getFragment('viewer')}
      }
    `,
  },
});
