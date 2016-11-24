import Relay from 'react-relay';

export default class DeletePostMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{deletePost}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeletePostPayload @relay(pattern: true){
        deletedPostId,
        viewer {
          posts
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'posts',
      deletedIDFieldName: 'deletedPostId',
    }];
  }
  getVariables() {
    return {
      id: this.props.id,
    };
  }
  getOptimisticResponse() {
    const viewerPayload = {id: this.props.viewer.id};
    return {
      deletedPostId: this.props.id,
      viewer: viewerPayload,
    };
  }
}
