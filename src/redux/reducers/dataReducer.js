import { LOADING_DATA, LIKE_POST, UNLIKE_POST, SET_POSTS, DELETE_POST, ADD_POST, SET_POST, ADD_COMMENT } from '../types';

const initialState = {
  posts: [],
  post: {},
  loading: false
}

export default function (state = initialState, action) {
  let index;
  switch (action.type) {
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      }

    case SET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      }

    case LOADING_DATA:
      return {
        loading: true,
        ...state
      }

    case LIKE_POST:
    case UNLIKE_POST:
      index = state.posts.findIndex(post => post.postId === action.payload.post.postId);
      state.posts[index] = action.payload.post;
      if (state.post.postId === action.payload.post.postId)
        state.post = action.payload.post;
      return {
        ...state
      }

    case DELETE_POST:
      index = state.posts.findIndex(post => post.postId === action.payload);
      state.posts.splice(index, 1);
      return {
        ...state
      };

    case ADD_POST:
      return {
        ...state,
        posts: [
          action.payload,
          ...state.posts
        ]
      };

    case ADD_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: [
            action.payload.comment,
            ...state.post.comments
          ],
        }
      };

    default:
      return state;
  }
}