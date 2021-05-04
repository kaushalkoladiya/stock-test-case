import {
  SET_POSTS,
  UNLIKE_POST,
  LIKE_POST,
  LOADING_DATA,
  DELETE_POST,
  LOADING_UI,
  ADD_POST,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_POST,
  STOP_LOADING_UI,
  ADD_COMMENT
} from '../types';
import axios from 'axios';

export const getPosts = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios.get('/post')
    .then(({ data: { posts } }) => {
      dispatch({
        type: SET_POSTS,
        payload: posts
      });
    })
    .catch(err => {
      dispatch({
        type: SET_POSTS,
        payload: []
      })
    });
}

export const getPost = (postId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.get(`/post/${postId}`)
    .then(({ data: { post } }) => {
      dispatch({
        type: SET_POST,
        payload: post
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => {
      dispatch({
        type: SET_POST,
        payload: []
      })
    });
}

export const likePost = (postId) => (dispatch) => {
  axios.post(`/like/${postId}/store`)
    .then((res) => {
      dispatch({
        type: LIKE_POST,
        payload: res.data
      })
    })
    .catch((err) => console.log(err.response))
}

export const unlikePost = (postId) => (dispatch) => {
  axios.post(`/like/${postId}/delete`)
    .then((res) => {
      dispatch({
        type: UNLIKE_POST,
        payload: res.data
      })
    })
    .catch((err) => console.log(err.response))
}

export const deletePost = (postId) => (dispatch) => {
  axios.delete(`/post/${postId}`)
    .then((res) => {
      dispatch({
        type: DELETE_POST,
        payload: postId
      })
    })
    .catch((err) => console.log(err));
}

export const addPost = (postData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.post('/post', postData)
    .then(({ data: { post } }) => {
      dispatch({
        type: ADD_POST,
        payload: post
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch(({ response: { data: { error } } }) => {
      console.log(error);
      dispatch({
        type: SET_ERRORS,
        payload: error
      })
    });
}

export const addComment = (postId, commentData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios.post(`/comment/${postId}/store`, commentData)
    .then((res) => {
      dispatch({
        type: ADD_COMMENT,
        payload: res.data
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch(({ response: { data: { error } } }) => {
      console.log(error);
      dispatch({
        type: SET_ERRORS,
        payload: error
      })
    });
}

export const getUser = (username) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios.get(`/user/${username}`)
    .then(({ data: { userData } }) => {
      dispatch({
        type: SET_POSTS,
        payload: userData.posts
      });
    })
    .catch(err => {
      dispatch({
        type: SET_POSTS,
        payload: null
      })
    });
}