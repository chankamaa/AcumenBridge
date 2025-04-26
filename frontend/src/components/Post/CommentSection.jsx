// src/components/Post/CommentSection.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  Menu,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  getCommentsByPost,
  addComment,
  updateComment,
  deleteComment
} from '../../services/interactionService';

export default function CommentSection({ postId }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [comments, setComments]    = useState([]);
  const [loading,  setLoading]     = useState(true);
  const [text,     setText]        = useState('');
  const [posting,  setPosting]     = useState(false);

  // menu/edit state
  const [anchorEl,      setAnchorEl]      = useState(null);
  const [selComment,    setSelComment]    = useState(null);
  const [editingId,     setEditingId]     = useState(null);
  const [editText,      setEditText]      = useState('');
  const [processingId,  setProcessingId]  = useState(null);

  // load
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getCommentsByPost(postId);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  // new comment
  const handleSubmit = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await addComment(postId, text);
      setComments(c => [res.data, ...c]);
      setText('');
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  // menu open/close
  const openMenu = (e, comment) => {
    setAnchorEl(e.currentTarget);
    setSelComment(comment);
  };
  const closeMenu = () => {
    setAnchorEl(null);
    setSelComment(null);
  };

  // start edit
  const startEdit = () => {
    setEditingId(selComment.id);
    setEditText(selComment.text);
    closeMenu();
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // save edit
  const saveEdit = async () => {
    setProcessingId(editingId);
    try {
      const res = await updateComment(editingId, editText);
      setComments(cs => cs.map(c => c.id === editingId ? res.data : c));
      cancelEdit();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // delete
  const handleDelete = async () => {
    const cid = selComment.id;
    closeMenu();
    if (!window.confirm('Delete this comment?')) return;
    setProcessingId(cid);
    try {
      await deleteComment(cid);
      setComments(cs => cs.filter(c => c.id !== cid));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <CircularProgress size={24} sx={{ py:2 }} />;
  }

  return (
    <Box sx={{ px:2, pb:2 }}>
      {/* New comment */}
      <Box sx={{ display:'flex', alignItems:'center', mb:1 }}>
        <TextField
          fullWidth size="small" multiline
          placeholder="Write a comment…"
          value={text} onChange={e => setText(e.target.value)}
        />
        <IconButton
          onClick={handleSubmit}
          disabled={posting || !text.trim()}
          sx={{ ml:1 }}
        >
          <SendIcon />
        </IconButton>
      </Box>

      {/* List */}
      {comments.map(c => {
        const isAuthor = user && c.authorId === user.id;
        return (
          <Box key={c.id} sx={{ display:'flex', mb:1, position:'relative' }}>
            <Avatar
              src={c.authorAvatar}
              alt={c.authorName}
              sx={{ width:32, height:32, mr:1, cursor:'pointer' }}
              onClick={() => navigate(`/profile/${c.authorId}`)}
            />
            <Box sx={{ flex:1 }}>
              <Box sx={{ display:'flex', alignItems:'center', mb:0.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ cursor:'pointer', '&:hover':{textDecoration:'underline'} }}
                  onClick={() => navigate(`/profile/${c.authorId}`)}
                >
                  {c.authorName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml:1 }}
                >
                  {new Date(c.createdAt).toLocaleString()}
                </Typography>
              </Box>
              {editingId === c.id ? (
                <>
                  <TextField
                    fullWidth size="small" multiline
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                  />
                  <Box sx={{ display:'flex', gap:1, mt:1 }}>
                    <Button
                      size="small" variant="contained"
                      onClick={saveEdit}
                      disabled={!editText.trim() || processingId===c.id}
                    >
                      Save
                    </Button>
                    <Button size="small" variant="outlined" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography variant="body2">{c.text}</Typography>
              )}
            </Box>

            {/* three-dot for comment author */}
            {isAuthor && (
              <IconButton
                size="small"
                onClick={e => openMenu(e, c)}
                disabled={processingId===c.id}
                sx={{ position:'absolute', top:0, right:0 }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      })}

      {/* Shared menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
        transformOrigin={{ vertical:'top',    horizontal:'right' }}
      >
        <MenuItem onClick={startEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}
