package com.codecool.goMove.controller;

import com.codecool.goMove.model.Activity;
import com.codecool.goMove.model.ActivityType;
import com.codecool.goMove.model.User;
import com.codecool.goMove.repository.ActivityRepository;
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
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
@Transactional
class ActivityControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanUpEach() {
        activityRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    public void testGetAllActivities() throws Exception {
        mockMvc.perform(get("/activities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Wycieczka rowerowa"))
                .andExpect(jsonPath("$[1].title").value("Bieg w parku"));

    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    public void testGetFutureActivities() throws Exception {
        mockMvc.perform(get("/activities/future"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Wycieczka rowerowa"))
                .andExpect(jsonPath("$[1].title").value("Bieg w parku"));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    public void testGetActivityById() throws Exception {
        List<Activity> activities = activityRepository.findAll();
        UUID activityId = activities.get(0).getActivityId();

        mockMvc.perform(get("/activities/{id}", activityId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activityId").value(activityId.toString()));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    public void testGetActivitiesByTypeAndCity() throws Exception {
        mockMvc.perform(get("/activities/filter")
                        .param("city", "Warszawa")
                        .param("type", "CYCLING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].city").value("Warszawa"))
                .andExpect(jsonPath("$[0].activityType").value("CYCLING"));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    public void testGetActivitiesByOwner() throws Exception {
        UUID ownerId = UUID.fromString("4444e1a7-7acf-4f50-8275-1449748e96eb");

        mockMvc.perform(get("/activities/user/{ownerId}", ownerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    @Sql("/user_activity.sql")
    public void testGetActivitiesByParticipant() throws Exception {
        UUID participantId = UUID.fromString("3333e1a7-7acf-4f50-8275-1449748e96eb");

        mockMvc.perform(get("/activities/participant/{participantId}", participantId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    @Sql("/user_activity.sql")
    public void testGetAllCities() throws Exception {
        mockMvc.perform(get("/activities/cities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    @Sql("/user_activity.sql")
    public void testAddActivity() throws Exception {
        UUID userId = UUID.fromString("1111e1a7-7acf-4f50-8275-1449748e96eb");
        User owner = userRepository.findById(userId).orElseThrow();

        Activity activity = new Activity();
        activity.setActivityType(ActivityType.RUNNING);
        activity.setOwner(owner);
        activity.setTitle("Bieg rano");
        activity.setCity("Kraków");
        activity.setAddress("Ruczaj");
        activity.setDate(LocalDate.of(2023, 12, 01));
        activity.setTime(LocalTime.now());
        activity.setDescription("Bieg poranny po okolicy");

        String jsonRequest = objectMapper.writeValueAsString(activity);

        mockMvc.perform(post("/activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.country").value("country is mandatory"))
                .andExpect(jsonPath("$.street").value("street is mandatory"));
    }

    @Test
    @Sql("/users.sql")
    @Sql("/activities.sql")
    @Sql("/user_activity.sql")
    public void testUpdateActivity() throws Exception {
        UUID activityIdToUpdate = UUID.fromString("5555e1a7-7acf-4f50-8275-1449748e96eb");
        Activity updatedActivity = new Activity();
        updatedActivity.setActivityType(ActivityType.RUNNING);
        updatedActivity.setAddress("Ruczaj");
        updatedActivity.setDate(LocalDate.of(2023, 9, 1));
        updatedActivity.setTime(LocalTime.of(8, 0));
        updatedActivity.setDescription("Bieg poranny po okolicy");

        String jsonRequest = objectMapper.writeValueAsString(updatedActivity);

        mockMvc.perform(patch("/activities/update/{id}", activityIdToUpdate)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(content().string("Activity updated"));
    }

}