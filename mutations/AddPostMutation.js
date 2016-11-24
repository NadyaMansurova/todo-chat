import Relay from 'react-relay';
import moment from 'moment';

export default class AddPostMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{addPost}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddPostPayload {
        postEdge,
        viewer {
          posts
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'post',
      edgeName: 'postEdge',
      rangeBehaviors: {
        '': 'append',
        'orderby(newest)': 'prepend'
      },
    }];
  }
  getVariables() {
    return {
      text: this.props.text,
    };
  }
  getOptimisticResponse() {
    return {
      postEdge: {
        node: {
          text: this.props.text,
          data: moment().toISOString()
        },
      },
      viewer: {
        id: this.props.viewer.id
      },
    };
  }
}
