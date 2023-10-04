package com.codecool.goMove.controller;

import com.codecool.goMove.model.Role;
import com.codecool.goMove.model.User;
import com.codecool.goMove.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
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
import org.springframework.test.web.servlet.MvcResult;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
@Transactional
class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanUpEach() {
        userRepository.deleteAll();
    }

    @Test
    @Sql("/users.sql")
    public void testGetAllUsers() {
        MvcResult mvcResult = null;
        try {
            mvcResult = mockMvc.perform(get("/users"))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andReturn();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        String jsonResponse = null;
        try {
            jsonResponse = mvcResult.getResponse().getContentAsString();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        List<User> users = null;
        try {
            users = objectMapper.readValue(jsonResponse, new TypeReference<List<User>>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        assertNotNull(users);
        assertEquals(4, users.size());
        assertTrue(users.stream().allMatch(user -> user.getRole() == Role.USER));
    }

    @Test
    @Sql("/users.sql")
    public void testGetUserByIdExistingUser() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setUserId(userId);
        user.setUserName("testuser");
        user.setUserEmail("testuser@gmail.com");
        user.setPassword("testuser");
        userRepository.save(user);

        mockMvc.perform(get("/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    @Sql("/users.sql")
    public void testGetUserByIdNonExistingUser() throws Exception {
        UUID nonExistingUserId = UUID.randomUUID();

        mockMvc.perform(get("/users/{id}", nonExistingUserId))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("No user with requested id"));
    }

    @Test
    @Sql("/users.sql")
    public void testGetUserByNameExistingUser() throws Exception {
        String userName = "Mateusz";

        mockMvc.perform(get("/users/name/{name}", userName))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(userName));
    }

    @Test
    @Sql("/users.sql")
    public void testGetUserByNameNonExistingUser() throws Exception {
        String userName = "nonexistinguser";

        mockMvc.perform(get("/users/name/{name}", userName))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("No user with requested name"));
    }

    @Test
    @Sql("/users.sql")
    public void testUpdateUserExistingUser() throws Exception {
        UUID userID = UUID.fromString("3333e1a7-7acf-4f50-8275-1449748e96eb");

        User updatedUser = new User();
        updatedUser.setUserName("updateduser");

        String requestBody = objectMapper.writeValueAsString(updatedUser);

        mockMvc.perform(patch("/users/update/{id}", userID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().string("User updated"));

        User userAfterUpdate = userRepository.findById(userID).orElse(null);
        assertNotNull(userAfterUpdate);
    }

    @Test
    @Sql("/users.sql")
    public void testUpdateUserNonExistingUser() throws Exception {
        UUID nonExistingUserId = UUID.randomUUID();
        User updatedUser = new User();
        updatedUser.setUserName("updateduser");

        String requestBody = objectMapper.writeValueAsString(updatedUser);

        mockMvc.perform(patch("/users/update/{id}", nonExistingUserId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("No user with requested id"));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    public void testEnrollUserSuccess() throws Exception {
        UUID userId = UUID.fromString("4444e1a7-7acf-4f50-8275-1449748e96eb");
        UUID activityId = UUID.fromString("5555e1a7-7acf-4f50-8275-1449748e96eb");

        mockMvc.perform(patch("/users/enroll/{userId}/{activityId}", userId, activityId))
                .andExpect(status().isOk())
                .andExpect(content().string("User enrolled to the activity"));

        User userAfterEnrollment = userRepository.findById(userId).orElse(null);
        assertNotNull(userAfterEnrollment);
        assertTrue(userAfterEnrollment.getEnrolledActivities().stream()
                .anyMatch(activity -> activity.getActivityId().equals(activityId)));
    }


}