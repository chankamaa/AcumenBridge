// src/components/Post/PostCard.jsx
import React, { useState, useContext, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { AuthContext } from '../../context/AuthContext';
import { likePost, unlikePost } from '../../services/interactionService';
import CommentSection from './CommentSection';

export default function PostCard({ post, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [anchorEl, setAnchorEl]         = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likesCount, setLikesCount]     = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked]           = useState(false);
  const [showComments, setShowComments] = useState(false);

  // three-dot menu
  const menuOpen = Boolean(anchorEl);
  const openMenu = e => setAnchorEl(e.currentTarget);
  const closeMenu= () => setAnchorEl(null);

  const handleEdit   = () => { closeMenu(); onEdit && onEdit(post); };
  const handleDelete = () => { closeMenu(); onDelete && onDelete(post); };

  // track liked state
  useEffect(() => {
    if (user && Array.isArray(post.likes)) {
      setIsLiked(post.likes.includes(user.id));
    }
  }, [user, post.likes]);

  // like/unlike
  const toggleLike = async () => {
    if (!user) return;
    try {
      if (isLiked) {
        await unlikePost(post.id);
        setLikesCount(c => c - 1);
      } else {
        await likePost(post.id);
        setLikesCount(c => c + 1);
      }
      setIsLiked(l => !l);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // carousel controls
  const media   = post.mediaUrls || [];
  const total   = media.length;
  const url     = media[currentIndex] || '';
  const isVideo = /\.(mp4|webm)$/i.test(url);
  const goPrev  = () => setCurrentIndex(i => Math.max(0, i - 1));
  const goNext  = () => setCurrentIndex(i => Math.min(total - 1, i + 1));

  // navigate to user profile
  const goToProfile = () => navigate(`/profile/${post.userId}`);

  return (
    <Card sx={{ mb:2, borderRadius:2, boxShadow:1, position: 'relative' }}>
      <CardHeader
        avatar={
          <Avatar
            src={post.userAvatar}
            alt={post.userName}
            sx={{ cursor: 'pointer' }}
            onClick={goToProfile}
          />
        }
        action={
          <>
            <IconButton onClick={openMenu}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={closeMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </>
        }
        title={
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ cursor: 'pointer' }}
            onClick={goToProfile}
          >
            {post.userName}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
        }
      />

      <CardContent sx={{ pt:0 }}>
        <Typography variant="body1" sx={{ whiteSpace:'pre-wrap', mb:2 }}>
          {post.description}
        </Typography>
      </CardContent>

      {total > 0 && (
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component={isVideo ? 'video' : 'img'}
            src={url}
            controls={isVideo}
            alt={isVideo ? undefined : `media-${currentIndex}`}
            sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
          />

          {total > 1 && (
            <>
              {currentIndex > 0 && (
                <IconButton
                  onClick={goPrev}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              )}
              {currentIndex < total - 1 && (
                <IconButton
                  onClick={goNext}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              )}
            </>
          )}
        </Box>
      )}

      <CardActions disableSpacing>
        <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
          <IconButton onClick={toggleLike}>
            <Badge badgeContent={likesCount} color="primary">
              {isLiked
                ? <FavoriteIcon color="error" />
                : <FavoriteBorderIcon />
              }
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Comments">
          <IconButton onClick={() => setShowComments(s => !s)}>
            <Badge badgeContent={post.comments?.length || 0} color="primary">
              <ChatBubbleOutlineIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </CardActions>

      {showComments && <CommentSection postId={post.id} />}
    </Card>
  );
}
