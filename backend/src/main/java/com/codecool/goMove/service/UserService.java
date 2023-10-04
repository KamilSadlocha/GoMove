package com.codecool.goMove.service;

import com.codecool.goMove.model.Activity;
import com.codecool.goMove.model.User;
import com.codecool.goMove.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserImageService userImageService;


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        Optional<User> optionalUser = findById(id);
        return optionalUser.orElse(null);
    }

    public User getUserByName(String name) {
        Optional<User> optionalUser = userRepository.findByUserName(name);
        return optionalUser.orElse(null);
    }

    public boolean updateUser(User user, UUID id) {
        Optional<User> optionalUser = findById(id);
        if (optionalUser.isEmpty()) {
            return false;
        }

        User userToUpdate = optionalUser.get();
        if (user.getUsername() != null) {
            userToUpdate.setUserName(user.getUsername());
        }
        if (user.getUserEmail() != null) {
            userToUpdate.setUserEmail(user.getUserEmail());
        }
        if (user.getPassword() != null) {
            userToUpdate.setPassword(user.getPassword());
        }
        if (user.getCity() != null) {
            userToUpdate.setCity(user.getCity());
        }
        if (user.getPreferredActivity() != null) {
            userToUpdate.setPreferredActivity(user.getPreferredActivity());
        }
        if (user.getDescription() != null) {
            userToUpdate.setDescription(user.getDescription());
        }
        if (user.getUserPhoto() != null) {
            try {
                userImageService.removeImage(userToUpdate.getPhotoName());
                userToUpdate.setPhotoName(userImageService.uploadImage(user.getUserPhoto()));
            } catch (IOException exception) {
                //TODO add logging exception, send info to frontend
                exception.printStackTrace();
            }
        }
        userRepository.save(userToUpdate);
        return true;
    }

    private Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    public boolean enrollUser(UUID userId, UUID activityId) {
        User userToUpdate = getUserById(userId);
        if (userToUpdate == null) {
            return false;
        }
        Set<Activity> enrolledActivities = userToUpdate.getEnrolledActivities();
        Activity activityToAdd = new Activity();
        activityToAdd.setActivityId(activityId);
        enrolledActivities.add(activityToAdd);
        userRepository.save(userToUpdate);
        return true;
    }

}
