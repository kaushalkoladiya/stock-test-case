import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../../redux/actions/dataAction';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import TooltipButton from './Button';

const likeButton = (
  { postId,
    user,
    likePost: likePostFunc,
    unlikePost: unlikePostFunc }
) => {

  const likedPost = () => {
    const like = user.likes.find(like => like.postId === postId);
    if (user.likes && like) {
      return true;
    } else {
      return false;
    }
  }

  const likePost = () => {
    likePostFunc(postId);
  }

  const unlikePost = () => {
    unlikePostFunc(postId);
  }

  return (
    <Fragment>
      {!user.isAuth ? (
        <TooltipButton
          title="Like"
          placement="top" >
          <Link to="/login">
            <FavoriteBorder color="error" />
          </Link>
        </TooltipButton >
      ) : (
          likedPost() ? (
            <TooltipButton
              title="Undo Like"
              placement="top"
              onClick={unlikePost} >
              <FavoriteIcon color="error" />
            </TooltipButton >
          ) : (
              <TooltipButton
                title="Like"
                placement="top"
                onClick={likePost} >
                <FavoriteBorder color="error" />
              </TooltipButton >
            )
        )
      }
    </Fragment>
  );
}


likeButton.propTypes = {
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

const mapToStateProps = state => ({
  user: state.user
})

export default connect(mapToStateProps, { likePost, unlikePost })(likeButton);