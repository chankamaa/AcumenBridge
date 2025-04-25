// src/components/Post/PostCard.jsx
import React, { useState } from 'react';
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export default function PostCard({ post, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = e => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleEdit   = () => { handleMenuClose(); onEdit(post); };
  const handleDelete = () => { handleMenuClose(); onDelete(post); };

  const likedBy     = (post.likes || []).join(', ') || 'No likes yet';
  const commentedBy = (post.comments || []).map(c => c.authorName).join(', ') || 'No comments yet';

  return (
    <Card sx={{ mb:2, borderRadius:2, boxShadow:1 }}>
      <CardHeader
        avatar={<Avatar src={post.userAvatar} alt={post.userName} />}
        action={
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top',    horizontal: 'right' }}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </>
        }
        title={<Typography variant="subtitle1" fontWeight="bold">{post.userName}</Typography>}
        subheader={<Typography variant="caption" color="text.secondary">
          {new Date(post.createdAt).toLocaleString()}
        </Typography>}
      />

      <CardContent sx={{ pt:0 }}>
        <Typography variant="body1" sx={{ whiteSpace:'pre-wrap', mb:2 }}>
          {post.description}
        </Typography>
      </CardContent>

      {/* MEDIA */}
      {post.mediaUrls?.map((url,i) => {
        const isVideo = /\.(mp4|webm)$/i.test(url);
        return (
          <CardMedia
            key={i}
            component={isVideo ? 'video' : 'img'}
            src={url}
            controls={isVideo}
            alt={isVideo ? undefined : `media-${i}`}
            sx={{
              width: '100%',
              height: 'auto',
              mb: 1,
              borderRadius: 1,
            }}
          />
        );
      })}

      <CardActions disableSpacing>
        <Tooltip title={likedBy}>
          <IconButton>
            <Badge badgeContent={post.likes?.length || 0} color="primary">
              <FavoriteBorderIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title={commentedBy}>
          <IconButton>
            <Badge badgeContent={post.comments?.length || 0} color="primary">
              <ChatBubbleOutlineIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
