// src/components/manga/CommentSection.jsx
// Simple comments UI: list + post + reply + like/dislike + delete.
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import apiService from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const CommentItem = ({ comment, onReply, onLike, onDislike, onDelete, currentUser }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await onReply(replyText.trim(), comment.id);
      setReplyText('');
      setShowReply(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center">
            {comment.user?.avatar_url ? (
              <img
                src={comment.user.avatar_url}
                alt={comment.user.username}
                className="rounded-circle me-2"
                style={{ width: 32, height: 32, objectFit: 'cover' }}
              />
            ) : (
              <i className="fas fa-user-circle fa-2x text-muted me-2"></i>
            )}
            <div>
              <strong>{comment.user?.username || 'Anonymous'}</strong>
              {comment.is_pinned && (
                <Badge bg="warning" text="dark" className="ms-2">
                  <i className="fas fa-thumbtack me-1"></i>Pinned
                </Badge>
              )}
              <div className="text-muted small">{formatDate(comment.created_at)}</div>
            </div>
          </div>
          {comment.can_delete && (
            <Button
              variant="link"
              size="sm"
              className="text-danger p-0"
              onClick={() => onDelete(comment.id)}
              title="Delete"
            >
              <i className="fas fa-trash"></i>
            </Button>
          )}
        </div>

        {comment.is_spoiler ? (
          <details className="mb-2">
            <summary className="text-warning">
              <i className="fas fa-eye-slash me-1"></i>Spoiler — click to reveal
            </summary>
            <p className="mt-2 mb-0">{comment.content}</p>
          </details>
        ) : (
          <p className="mb-2">{comment.content}</p>
        )}

        <div className="d-flex gap-3 small">
          <Button variant="link" size="sm" className="p-0" onClick={() => onLike(comment.id)}>
            <i className="fas fa-thumbs-up me-1"></i>
            {comment.likes_count}
          </Button>
          <Button variant="link" size="sm" className="p-0 text-muted" onClick={() => onDislike(comment.id)}>
            <i className="fas fa-thumbs-down me-1"></i>
            {comment.dislikes_count}
          </Button>
          {currentUser && comment.parent === null && (
            <Button variant="link" size="sm" className="p-0" onClick={() => setShowReply((v) => !v)}>
              <i className="fas fa-reply me-1"></i>Reply
            </Button>
          )}
        </div>

        {showReply && (
          <Form onSubmit={submitReply} className="mt-3">
            <Form.Control
              as="textarea"
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              maxLength={1000}
            />
            <div className="d-flex justify-content-end gap-2 mt-2">
              <Button size="sm" variant="secondary" onClick={() => setShowReply(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={submitting || !replyText.trim()}>
                {submitting ? <Spinner size="sm" animation="border" /> : 'Reply'}
              </Button>
            </div>
          </Form>
        )}

        {comment.replies?.length > 0 && (
          <div className="mt-3 ms-4 ps-3 border-start">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
                onDislike={onDislike}
                onDelete={onDelete}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const CommentSection = ({ mangaSlug }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [posting, setPosting] = useState(false);

  const loadComments = useCallback(async () => {
    if (!mangaSlug) return;
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getMangaComments(mangaSlug);
      const data = response.data?.results ?? response.data ?? [];
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('Unable to load comments.');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [mangaSlug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;
    setPosting(true);
    try {
      await apiService.postComment(mangaSlug, newComment.trim(), null);
      setNewComment('');
      setIsSpoiler(false);
      await loadComments();
    } catch (err) {
      console.error('Failed to post comment:', err);
      setError('Failed to post comment.');
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (content, parentId) => {
    try {
      await apiService.postComment(mangaSlug, content, parentId);
      await loadComments();
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };

  const handleLike = async (commentId) => {
    if (!isAuthenticated) return;
    try {
      await apiService.likeComment(commentId);
      await loadComments();
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const handleDislike = async (commentId) => {
    if (!isAuthenticated) return;
    try {
      await apiService.dislikeComment(commentId);
      await loadComments();
    } catch (err) {
      console.error('Failed to dislike comment:', err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await apiService.deleteComment(commentId);
      await loadComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className="comment-section">
      <h4 className="mb-3">
        <i className="fas fa-comments me-2"></i>
        Comments ({comments.length})
      </h4>

      {error && <Alert variant="danger">{error}</Alert>}

      {isAuthenticated ? (
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={1000}
            />
            <Form.Text className="text-muted">{newComment.length}/1000</Form.Text>
          </Form.Group>
          <div className="d-flex justify-content-between align-items-center">
            <Form.Check
              type="checkbox"
              label="Mark as spoiler"
              checked={isSpoiler}
              onChange={(e) => setIsSpoiler(e.target.checked)}
            />
            <Button type="submit" disabled={posting || !newComment.trim()}>
              {posting ? <Spinner size="sm" animation="border" /> : 'Post Comment'}
            </Button>
          </div>
        </Form>
      ) : (
        <Alert variant="info">
          <i className="fas fa-info-circle me-2"></i>
          <a href="/login">Log in</a> to leave a comment.
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center text-muted py-4">
          <i className="fas fa-comment-slash fa-2x mb-2"></i>
          <p className="mb-0">No comments yet. Be the first!</p>
        </div>
      ) : (
        comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            onReply={handleReply}
            onLike={handleLike}
            onDislike={handleDislike}
            onDelete={handleDelete}
            currentUser={user}
          />
        ))
      )}
    </div>
  );
};

export default CommentSection;
