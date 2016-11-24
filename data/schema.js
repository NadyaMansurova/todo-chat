/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Widget,
  Post,
  getUser,
  getViewer,
  getWidget,
  getWidgets,
  getPosts,
  getPost,
  editPost,
  deletePost,
  addPost
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Widget') {
      return getWidget(id);
    } else if (type === 'Post') {
      return getPost(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Widget)  {
      return widgetType;
    } else if (obj instanceof Post)  {
      return postType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    avatar: {
      type: GraphQLString,
      description: 'The avatar of the user',
    },
    widgets: {
      type: widgetConnection,
      description: 'A person\'s collection of widgets',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getWidgets(), args),
    },
    posts: {
      type: postConnection,
      description: 'A person\'s collection of posts',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getPosts(), args),
    },
  }),
  interfaces: [nodeInterface],
});

var widgetType = new GraphQLObjectType({
  name: 'Widget',
  description: 'A shiny widget',
  fields: () => ({
    id: globalIdField('Widget'),
    name: {
      type: GraphQLString,
      description: 'The name of the widget',
    },
  }),
  interfaces: [nodeInterface],
});


var postType = new GraphQLObjectType({
  name: 'Post',
  description: 'User post',
  fields: () => ({
    id: globalIdField('Post'),
    text: {
      type: GraphQLString,
      description: 'The name of the post',
    },
    data: {
      type: GraphQLString,
      description: 'The data of the post',
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
const {connectionType: widgetConnection} =
  connectionDefinitions({name: 'Widget', nodeType: widgetType});

const {
  connectionType: postConnection,
  edgeType: GraphQLPostEdge
} = connectionDefinitions({
    name: 'Post',
    nodeType: postType
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */

const GraphQLEditPostMutation = mutationWithClientMutationId({
   name: 'EditPost',
   inputFields: {
     text: { type: new GraphQLNonNull(GraphQLString) },
     id: { type: new GraphQLNonNull(GraphQLID) },
   },
   outputFields: {
     post: {
       type: postType,
       resolve: ({localPostId}) => getPost(localPostId),
     },
     viewer: {
       type: userType,
       resolve: () => getViewer(),
     },
   },
   mutateAndGetPayload: ({id, text}) => {
     const localPostId = fromGlobalId(id).id;
     editPost(localPostId, text);
     return {localPostId};
   },
});

const GraphQLAddPostMutation = mutationWithClientMutationId({
  name: 'AddPost',
  inputFields: {
     text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    postEdge: {
      type: GraphQLPostEdge,
      resolve: ({localPostId}) => {
        const post = getPost(localPostId);
        log(post);
        return {
           cursor: cursorForObjectInConnection(getPosts(), post),
           node: post,
        };
      },
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({text}) => {
    const localPostId = addPost(text);
    return {localPostId};
  },
});

const GraphQLDeletePostMutation = mutationWithClientMutationId({
  name: 'DeletePost',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedPostId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    }
  },
  mutateAndGetPayload: ({id}) => {
    const localPostId = fromGlobalId(id).id;
    deletePost(localPostId);
    return {id};
  },
});


var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addPost: GraphQLAddPostMutation,
    deletePost: GraphQLDeletePostMutation,
    editPost: GraphQLEditPostMutation,
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  mutation: mutationType
});
