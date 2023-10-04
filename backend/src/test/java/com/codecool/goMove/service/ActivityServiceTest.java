package com.codecool.goMove.service;

import com.codecool.goMove.model.Activity;
import com.codecool.goMove.model.ActivityType;
import com.codecool.goMove.model.User;
import com.codecool.goMove.repository.ActivityRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.test.context.support.WithMockUser;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @InjectMocks
    private ActivityService activityService;

    @Test
    void testGetAllActivities() {
        List<Activity> mockActivities = new ArrayList<>();
        Activity activity1 = new Activity();
        Activity activity2 = new Activity();
        mockActivities.add(activity1);
        mockActivities.add(activity2);

        when(activityRepository.findAll()).thenReturn(mockActivities);

        List<Activity> result = activityService.getAllActivities();

        assertEquals(2, result.size());
    }

    @Test
    void testGetFutureActivities(){
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        User user1 = new User();
        User user2 = new User();

        List<Activity> mockActivities = new ArrayList<>();
        mockActivities.add(new Activity(
                ActivityType.CYCLING,
                user1,
                "Activity 1",
                "City 1",
                "Street 1",
                today.plusDays(1),
                LocalTime.of(15, 0),
                "Description 1"
        ));
        mockActivities.add(new Activity(
                ActivityType.CYCLING,
                user2,
                "Activity 2",
                "City 2",
                "Street 2",
                today, // Today's date
                now.plusHours(1),
                "Description 2"
        ));
        mockActivities.add(new Activity(
                ActivityType.RUNNING,
                user1,
                "Activity 3",
                "City 3",
                "Street 3",
                today.minusDays(1),
                LocalTime.of(10, 0),
                "Description 3"
        ));

        when(activityRepository.findByDateAfter(today.minusDays(1))).thenReturn(mockActivities);

        List<Activity> result = activityService.getFutureActivities();

        assertEquals(2, result.size());
    }


    @Test
    void testGetActivityById() {
        UUID activityId = UUID.randomUUID();
        Activity mockActivity = new Activity();
        mockActivity.setActivityId(activityId);
        mockActivity.setTitle("Title");
        mockActivity.setCity("City");
        mockActivity.setDate(LocalDate.now());
        mockActivity.setTime(LocalTime.now());

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(mockActivity));

        Activity result = activityService.getActivityById(activityId);

        assertNotNull(result);
        assertEquals(activityId, result.getActivityId());
    }

    @Test
    void testGetActivitiesByTypeAndCity() {
        String city = "city";
        ActivityType activityType = ActivityType.CYCLING;
        List<Activity> activities = new ArrayList<>();
        Activity activity = new Activity();
        activity.setActivityType(activityType);
        activity.setCity(city);
        activities.add(activity);

        when(activityRepository.findByActivityTypeAndCity(activityType, city)).thenReturn(activities);

        List<Activity> result = activityService.getActivitiesByTypeAndCity(city, activityType);

        assertNotNull(result);
        assertEquals(result, activities);
        assertEquals(result.get(0).getCity(), activities.get(0).getCity());
        assertEquals(result.get(0).getActivityType(), activities.get(0).getActivityType());
    }

    @Test
    void testGetActivitiesByType(){
        ActivityType activityType = ActivityType.CYCLING;
        List<Activity> activities = new ArrayList<>();
        Activity activity = new Activity();
        activity.setActivityType(activityType);
        activity.setCity(null);
        activities.add(activity);

        when(activityRepository.findByActivityType(activityType)).thenReturn(activities);

        List<Activity> result = activityService.getActivitiesByTypeAndCity(null, activityType);

        assertNotNull(result);
        assertEquals(result, activities);
        assertEquals(result.get(0).getActivityType(), activities.get(0).getActivityType());
    }

    @Test
    void testGetActivitiesByCity() {
        String city = "city";
        List<Activity> activities = new ArrayList<>();
        Activity activity = new Activity();
        activity.setCity(city);
        activities.add(activity);

        when(activityRepository.findByCity(city)).thenReturn(activities);

        List<Activity> result = activityService.getActivitiesByTypeAndCity(city, null);

        assertNotNull(result);
        assertEquals(result, activities);
        assertEquals(result.get(0).getCity(), activities.get(0).getCity());
    }

    @Test
    void testGetActivitiesByOwner(){
        UUID ownerId = UUID.randomUUID();
        List<Activity> activities = new ArrayList<>();
        Activity activity = new Activity();
        User owner = new User();
        owner.setUserId(ownerId);
        activity.setOwner(owner);
        activities.add(activity);

        when(activityRepository.findByOwnerId(ownerId)).thenReturn(activities);

        List<Activity> result = activityService.getActivitiesByOwner(ownerId);

        assertNotNull(result);
        assertEquals(result, activities);
    }

    @Test
    void testGetActivitiesByParticipantId() {
        UUID participantId = UUID.randomUUID();
        List<Activity> activities = new ArrayList<>();

        Activity activity = new Activity();
        User owner = new User();
        owner.setUserId(participantId);

        Set<User> participant = new HashSet<>();
        participant.add(owner);
        activity.setParticipants(participant);
        activities.add(activity);

        when(activityRepository.getActivitiesByParticipantId(participantId)).thenReturn(activities);

        List<Activity> result = activityService.getActivitiesByParticipantId(participantId);

        assertNotNull(result);
        assertEquals(result, activities);
    }

    @Test
    void testGetAllCities() {
        List<String> mockCities = Arrays.asList("City1", "City2", "City3");

        when(activityRepository.getAllCities()).thenReturn(mockCities);

        List<String> result = activityService.getAllCities();

        assertEquals(3, result.size());
        assertTrue(result.contains("City1"));
        assertTrue(result.contains("City2"));
        assertTrue(result.contains("City3"));
    }

    @Test
    void testAddActivity_ActivityInPast() {
        Activity activityToAdd = new Activity();
        activityToAdd.setDate(LocalDate.now().minusDays(1));
        activityToAdd.setTime(LocalTime.now().minusHours(1));

        boolean result = activityService.addActivity(activityToAdd);

        assertFalse(result);
        verify(activityRepository, never()).save(activityToAdd);
    }

    @Test
    void testAddActivity_PastActivity() {
        Activity activityToAdd = new Activity(
                ActivityType.CYCLING,
                new User(),
                "Title",
                "City",
                "Street",
                LocalDate.now().minusDays(1),
                LocalTime.of(10, 0),
                "Description"
        );

        boolean result = activityService.addActivity(activityToAdd);

        assertFalse(result);
    }

    @Test
    void testUpdateActivity_ValidData() {
        UUID activityId = UUID.randomUUID();
        Activity existingActivity = new Activity(
                ActivityType.CYCLING,
                new User(),
                "Title",
                "City",
                "Street",
                LocalDate.now().plusDays(2),
                LocalTime.of(16, 0),
                "Description"
        );

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(existingActivity));
        when(activityRepository.save(existingActivity)).thenReturn(existingActivity);

        Activity updatedData = new Activity();
        updatedData.setActivityType(ActivityType.RUNNING);
        updatedData.setTitle("Updated Title");

        boolean result = activityService.updateActivity(updatedData, activityId);

        assertTrue(result);
        assertEquals(ActivityType.RUNNING, existingActivity.getActivityType());
        assertEquals("Updated Title", existingActivity.getTitle());
    }

    @Test
    void testUpdateActivity_NonexistentActivity() {
        UUID activityId = UUID.randomUUID();
        Activity updatedData = new Activity();
        updatedData.setActivityType(ActivityType.CYCLING);
        updatedData.setTitle("Updated Title");

        boolean result = activityService.updateActivity(updatedData, activityId);

        assertFalse(result);
    }

    @Test
    void testDeleteActivity_ActivityExists() {
        UUID activityId = UUID.randomUUID();
        Activity activityToDelete = new Activity();
        activityToDelete.setActivityId(activityId);

        Set<User> participants = new HashSet<>();
        User user1 = new User();
        Set<Activity> enrolledActivities = new HashSet<>();
        enrolledActivities.add(activityToDelete);
        user1.setEnrolledActivities(enrolledActivities);
        participants.add(user1);
        activityToDelete.setParticipants(participants);

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(activityToDelete));

        boolean result = activityService.deleteActivity(activityId);

        assertTrue(result);
        verify(activityRepository, times(1)).deleteById(activityId);
        assertTrue(user1.getEnrolledActivities().isEmpty());
    }

    @Test
    void testDeleteActivity_ActivityNotExists() {
        UUID activityId = UUID.randomUUID();

        when(activityRepository.findById(activityId)).thenReturn(Optional.empty());

        boolean result = activityService.deleteActivity(activityId);

        assertFalse(result);
        verify(activityRepository, never()).deleteById(any());
    }
}