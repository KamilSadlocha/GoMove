package com.codecool.goMove.service;

import com.codecool.goMove.model.Comment;
import com.codecool.goMove.repository.CommentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    @Test
    void testGetAllComments() {
        List<Comment> mockComments = new ArrayList<>();
        mockComments.add(new Comment());
        mockComments.add(new Comment());

        when(commentRepository.findAll()).thenReturn(mockComments);

        List<Comment> result = commentService.getAllComments();

        assertEquals(2, result.size());
    }

    @Test
    void testGetActivityComments() {
        UUID activityId = UUID.randomUUID();
        List<Comment> mockActivityComments = new ArrayList<>();
        mockActivityComments.add(new Comment());
        mockActivityComments.add(new Comment());

        when(commentRepository.findByActivityId(activityId)).thenReturn(mockActivityComments);

        List<Comment> result = commentService.getActivityComments(activityId);

        assertEquals(2, result.size());
    }

    @Test
    void testAddComment() {
        Comment newComment = new Comment();
        commentService.addComment(newComment);

        verify(commentRepository, times(1)).save(newComment);
    }

    @Test
    void testGetCommentById_ExistingComment() {
        UUID commentId = UUID.randomUUID();
        Comment existingComment = new Comment();
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));

        Comment result = commentService.getCommentById(commentId);

        assertNotNull(result);
        assertEquals(existingComment, result);
    }

    @Test
    void testGetCommentById_NonexistentComment() {
        UUID commentId = UUID.randomUUID();
        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        Comment result = commentService.getCommentById(commentId);

        assertNull(result);
    }

    @Test
    void testUpdateComment_ExistingComment() {
        UUID commentId = UUID.randomUUID();
        Comment existingComment = new Comment();
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));

        Comment updatedComment = new Comment();
        updatedComment.setMessage("Updated message");

        boolean result = commentService.updateComment(updatedComment, commentId);

        assertTrue(result);
        verify(commentRepository, times(1)).save(existingComment);
        assertEquals("Updated message", existingComment.getMessage());
    }

    @Test
    void testUpdateComment_NonexistentComment() {
        UUID commentId = UUID.randomUUID();
        Comment updatedComment = new Comment();
        updatedComment.setMessage("Updated message");

        boolean result = commentService.updateComment(updatedComment, commentId);

        assertFalse(result);
        verify(commentRepository, never()).save(any());
    }

    @Test
    void testDeleteComment_ExistingComment() {
        UUID commentId = UUID.randomUUID();
        Comment existingComment = new Comment();
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));

        boolean result = commentService.deleteComment(commentId);

        assertTrue(result);
        verify(commentRepository, times(1)).deleteById(commentId);
    }

    @Test
    void testDeleteComment_NonexistentComment() {
        UUID commentId = UUID.randomUUID();
        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        boolean result = commentService.deleteComment(commentId);

        assertFalse(result);
        verify(commentRepository, never()).deleteById(any());
    }
}