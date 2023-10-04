package com.codecool.goMove.service;

import com.codecool.goMove.model.Activity;
import com.codecool.goMove.model.User;
import com.codecool.goMove.model.ActivityType;
import com.codecool.goMove.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetAllUsers() {
        List<User> mockUsers = new ArrayList<>();
        mockUsers.add(new User());
        mockUsers.add(new User());

        when(userRepository.findAll()).thenReturn(mockUsers);

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
    }

    @Test
    void testGetUserById_ExistingUser() {
        UUID userId = UUID.randomUUID();
        User existingUser = new User();
        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));

        User result = userService.getUserById(userId);

        assertNotNull(result);
        assertEquals(existingUser, result);
    }

    @Test
    void testGetUserById_NonexistentUser() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        User result = userService.getUserById(userId);

        assertNull(result);
    }

    @Test
    void testGetUserByName_ExistingUser() {
        String userName = "TestUser";
        User existingUser = new User();
        when(userRepository.findByUserName(userName)).thenReturn(Optional.of(existingUser));

        User result = userService.getUserByName(userName);

        assertNotNull(result);
        assertEquals(existingUser, result);
    }

    @Test
    void testGetUserByName_NonexistentUser() {
        String userName = "NonexistentUser";
        when(userRepository.findByUserName(userName)).thenReturn(Optional.empty());

        User result = userService.getUserByName(userName);

        assertNull(result);
    }

    @Test
    void testUpdateUser_ExistingUser() {
        UUID userId = UUID.randomUUID();
        User existingUser = new User();
        existingUser.setUserId(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));

        User updatedUser = new User();
        updatedUser.setUserName("UpdatedUserName");
        updatedUser.setUserEmail("updated@example.com");
        updatedUser.setPassword("newPassword");
        updatedUser.setCity("NewCity");
        updatedUser.setPreferredActivity(ActivityType.CYCLING);

        boolean result = userService.updateUser(updatedUser, userId);

        assertTrue(result);
        verify(userRepository, times(1)).save(existingUser);
        assertEquals("UpdatedUserName", existingUser.getUsername());
        assertEquals("updated@example.com", existingUser.getUserEmail());
        assertEquals("newPassword", existingUser.getPassword());
        assertEquals("NewCity", existingUser.getCity());
        assertEquals(ActivityType.CYCLING, existingUser.getPreferredActivity());
    }

    @Test
    void testUpdateUser_NonexistentUser() {
        UUID userId = UUID.randomUUID();
        User updatedUser = new User();
        updatedUser.setUserName("UpdatedUserName");
        updatedUser.setUserEmail("updated@example.com");

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        boolean result = userService.updateUser(updatedUser, userId);

        assertFalse(result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testEnrollUser_ExistingUser() {
        UUID userId = UUID.randomUUID();
        User existingUser = new User();
        existingUser.setUserId(userId);

        UUID activityId = UUID.randomUUID();
        Activity activityToAdd = new Activity();

        activityToAdd.setActivityId(activityId);
        Set<Activity> enrolledActivities = new HashSet<>();

        activityToAdd.setActivityId(activityId);
        enrolledActivities.add(activityToAdd);
        existingUser.setEnrolledActivities(enrolledActivities);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));

        boolean result = userService.enrollUser(userId, activityId);

        assertTrue(result);
        verify(userRepository, times(1)).save(existingUser);
        assertTrue(existingUser.getEnrolledActivities().contains(activityToAdd));
    }

    @Test
    void testEnrollUser_NonexistentUser() {
        UUID userId = UUID.randomUUID();
        UUID activityId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        boolean result = userService.enrollUser(userId, activityId);

        assertFalse(result);
        verify(userRepository, never()).save(any());
    }
}