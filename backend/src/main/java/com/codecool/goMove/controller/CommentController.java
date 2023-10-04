package com.codecool.goMove.controller;

import com.codecool.goMove.model.Comment;
import com.codecool.goMove.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        return ResponseEntity.status(HttpStatus.OK).body(commentService.getAllComments());
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<List<Comment>> getActivityComments(@PathVariable UUID activityId) {
        return ResponseEntity.status(HttpStatus.OK).body(commentService.getActivityComments(activityId));
    }

    @PostMapping
    public ResponseEntity<String> addComment(@Valid @RequestBody Comment comment) {
        commentService.addComment(comment);
        return ResponseEntity.status(HttpStatus.OK).body("Comment added");
    }

    @PatchMapping("/update/{commentId}")
    public ResponseEntity<String> updateComment(@RequestBody Comment comment, @PathVariable UUID commentId) {
        boolean updatePerformed = commentService.updateComment(comment, commentId);
        if (updatePerformed) {
            return ResponseEntity.status(HttpStatus.OK).body("Comment updated");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No comment with requested id");
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable UUID commentId) {
        boolean deletePerformed = commentService.deleteComment(commentId);
        if (deletePerformed) {
            return ResponseEntity.status(HttpStatus.OK).body("Comment deleted");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No comment with requested id");
    }
}
