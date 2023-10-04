package com.codecool.goMove.service;

import com.codecool.goMove.model.Activity;
import com.codecool.goMove.model.ActivityType;
import com.codecool.goMove.model.User;
import com.codecool.goMove.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserService userService;
    private final ActivityImageService activityImageService;

    public ActivityService(ActivityRepository activityRepository, UserService userService, ActivityImageService activityImageService) {
        this.activityRepository = activityRepository;
        this.userService = userService;
        this.activityImageService = activityImageService;
    }

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public List<Activity> getFutureActivities() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        return activityRepository.findByDateAfter(today.minusDays(1)).stream()
                .filter(activity -> activity.getDate().isAfter(today)
                        || (activity.getDate().isEqual(today) && activity.getTime().isAfter(now)))
                .collect(Collectors.toList());
    }

    public Activity getActivityById(UUID id) {
        Optional<Activity> optionalActivityById = activityRepository.findById(id);
        return optionalActivityById.orElse(null);
    }

    public List<Activity> getActivitiesByTypeAndCity(String city, ActivityType type) {
        if (city == null && type != null) {
            return activityRepository.findByActivityType(type);
        } else if (city != null && type == null) {
            return activityRepository.findByCity(city);
        } else {
            return activityRepository.findByActivityTypeAndCity(type, city);
        }
    }

    public List<Activity> getActivitiesByOwner(UUID ownerId) {
        return activityRepository.findByOwnerId(ownerId);
    }

    public List<Activity> getActivitiesByParticipantId(UUID uuid) {
        return activityRepository.getActivitiesByParticipantId(uuid);
    }

    public List<String> getAllCities() {
        return activityRepository.getAllCities();
    }

    public boolean addActivity(Activity activity) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (activity.getDate().isAfter(today)
                || activity.getDate().equals(today) && activity.getTime().isAfter(now)) {
            try {
                if (activity.getActivityPhoto() != null) {
                    activityImageService.removeImage(activity.getPhotoName());
                    activity.setPhotoName(activityImageService.uploadImage(activity.getActivityPhoto()));
                }
            } catch (IOException exception) {
                //TODO add logging exception, send info to frontend
                exception.printStackTrace();
            }
            activityRepository.save(activity);
            userService.enrollUser(activity.getOwner().getUserId(), activity.getActivityId());
            return true;
        }
        return false;
    }

    public boolean updateActivity(Activity activity, UUID id) {
        Activity activityToUpdate = getActivityById(id);
        if (isNull(activityToUpdate)) {
            return false;
        }
        if (!isNull(activity.getActivityType())) {
            activityToUpdate.setActivityType(activity.getActivityType());
        }
        if (!isNull(activity.getTitle())) {
            activityToUpdate.setTitle(activity.getTitle());
        }
        if (!isNull(activity.getCity())) {
            activityToUpdate.setCity(activity.getCity());
        }
        if (!isNull(activity.getAddress())) {
            activityToUpdate.setAddress(activity.getAddress());
        }
        if (!isNull(activity.getDate())) {
            activityToUpdate.setDate(activity.getDate());
        }
        if (!isNull(activity.getTime())) {
            activityToUpdate.setTime(activity.getTime());
        }
        if (!isNull(activity.getDescription())) {
            activityToUpdate.setDescription(activity.getDescription());
        }
        activityRepository.save(activityToUpdate);
        return true;
    }

    public boolean deleteActivity(UUID id) {

        if (activityRepository.findById(id).isPresent()) {
            Activity activityToDelete = activityRepository.findById(id).get();
            Set<User> participants = new HashSet<>(activityToDelete.getParticipants());
            for (User user : participants) {
                activityToDelete.removeParticipant(user);
            }
            activityRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean unsubscribeFromActivity(UUID userId, UUID activityId) {
        Activity activity = getActivityById(activityId);
        User user = userService.getUserById(userId);
        if (activity.getParticipants().contains(user)) {
            activity.removeParticipant(user);
            activityRepository.save(activity);
            return true;
        }
        return false;
    }
}