import Relay from 'react-relay';

export default class EditPostMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{editPost}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on EditPostPayload @relay(pattern: true) {
        post {
          text,
        },
        viewer {
          posts,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        post: this.props.post.id,
        viewer: this.props.viewer.id,
      },
    }];
  }
  getVariables() {
    return {
      text: this.props.post.text,
      id: this.props.post.id,
    };
  }
  getOptimisticResponse() {
    const viewerPayload = {id: this.props.viewer.id};
    return {
      post: {
        text: this.props.post.text,
        id: this.props.post.id,
      },
      viewer: viewerPayload,
    };
  }
}
