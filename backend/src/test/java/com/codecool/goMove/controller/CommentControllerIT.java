package com.codecool.goMove.controller;

import com.codecool.goMove.model.Comment;
import com.codecool.goMove.repository.CommentRepository;
import com.codecool.goMove.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
@Transactional
class CommentControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanUpEach(){commentRepository.deleteAll();}

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    @Sql("/comments.sql")
    public void testGetAllComments() throws Exception {
        mockMvc.perform(get("/comments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].message").value("Robimy grila na koniec?"))
                .andExpect(jsonPath("$[1].message").value("No pewnie że tak !"))
                .andExpect(jsonPath("$[2].message").value("To ja wezmę ketchup."))
                .andExpect(jsonPath("$[3].message").value("Na pewno aktualne?"));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    @Sql("/comments.sql")
    public void testGetActivityComments() throws Exception {
        UUID activityId = UUID.fromString("5555e1a7-7acf-4f50-8275-1449748e96eb");

        mockMvc.perform(get("/comments/{activityId}", activityId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].message").value("Robimy grila na koniec?"))
                .andExpect(jsonPath("$[1].message").value("No pewnie że tak !"));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    @Sql("/comments.sql")
    public void testAddComment() throws Exception {
        UUID activityId = UUID.fromString("1111e4ee-06f5-40ab-935e-442074f939a1");
        UUID userId = UUID.fromString("2222e1a7-7acf-4f50-8275-1449748e96eb");
        Comment newComment = new Comment(LocalDate.now(), LocalTime.now(), userRepository.findById(userId).orElseThrow(), "Test comment", activityId);
        newComment.setActivityId(activityId);

        String jsonRequest = objectMapper.writeValueAsString(newComment);
        mockMvc.perform(post("/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(content().string("Comment added"));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    @Sql("/comments.sql")
    public void testUpdateComment() throws Exception {
        UUID commentIdToUpdate = UUID.fromString("11110b30-7557-4a9f-8527-3e50e933fec4");
        Comment updatedComment = commentRepository.findById(commentIdToUpdate).orElseThrow();
        updatedComment.setMessage("Updated message");

        String jsonRequest = objectMapper.writeValueAsString(updatedComment);
        mockMvc.perform(patch("/comments/update/{commentId}", commentIdToUpdate)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(content().string("Comment updated"));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    @Sql("/comments.sql")
    public void testDeleteComment() throws Exception {
        UUID commentIdToDelete = UUID.fromString("11110b30-7557-4a9f-8527-3e50e933fec4");

        mockMvc.perform(delete("/comments/delete/{commentId}", commentIdToDelete))
                .andExpect(status().isOk())
                .andExpect(content().string("Comment deleted"));
    }
}