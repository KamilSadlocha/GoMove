package com.codecool.goMove.controller;

import com.codecool.goMove.model.Activity;
import com.codecool.goMove.model.ActivityType;
import com.codecool.goMove.model.User;
import com.codecool.goMove.service.ActivityImageService;
import com.codecool.goMove.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/activities")
public class ActivityController {

    private final ActivityService activityService;
    private final ActivityImageService activityImageService;

    public ActivityController(ActivityService activityService, ActivityImageService activityImageService) {
        this.activityService = activityService;
        this.activityImageService = activityImageService;
    }

    @GetMapping
    public ResponseEntity<?> getAllActivities() {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getAllActivities());
    }

    @GetMapping("/future")
    public ResponseEntity<?> getFutureActivities() {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getFutureActivities().stream().peek(
                activity -> {
                    if (activity.getPhotoName() != null && !activity.getPhotoName().isEmpty()) {
                        activity.setActivityPhoto(activityImageService.getImage(activity.getPhotoName()));
                    }
                }
        ).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable UUID id) {
        Activity activityById = activityService.getActivityById(id);
        if (activityById.getPhotoName() != null && !activityById.getPhotoName().isEmpty()) {
            activityById.setActivityPhoto(activityImageService.getImage(activityById.getPhotoName()));
        }
        return ResponseEntity.status(HttpStatus.OK).body(activityById);
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getActivitiesByTypeAndCity(@RequestParam(required = false) String city,
                                                        @RequestParam(required = false) ActivityType type) {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getActivitiesByTypeAndCity(city, type).stream().peek(
                activity -> {
                    if (activity.getPhotoName() != null && !activity.getPhotoName().isEmpty()) {
                        activity.setActivityPhoto(activityImageService.getImage(activity.getPhotoName()));
                    }
                }
        ).collect(Collectors.toList()));
    }

    @GetMapping("/user/{ownerId}")
    public ResponseEntity<?> getActivitiesByOwner(@PathVariable UUID ownerId) {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getActivitiesByOwner(ownerId).stream().peek(
                activity -> {
                    if (activity.getPhotoName() != null && !activity.getPhotoName().isEmpty()) {
                        activity.setActivityPhoto(activityImageService.getImage(activity.getPhotoName()));
                    }
                }
        ).collect(Collectors.toList()));
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<?> getActivitiesByParticipant(@PathVariable UUID participantId) {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getActivitiesByParticipantId(participantId).stream().peek(
                activity -> {
                    if (activity.getPhotoName() != null && !activity.getPhotoName().isEmpty()) {
                        activity.setActivityPhoto(activityImageService.getImage(activity.getPhotoName()));
                    }
                }
        ).collect(Collectors.toList()));
    }

    @GetMapping("/cities")
    public ResponseEntity<?> getAllCities() {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getAllCities());
    }

    @PostMapping
    public ResponseEntity<?> addActivity(@Valid @RequestBody Activity activity) {
        boolean addPerformed = activityService.addActivity(activity);
        if (addPerformed) {
            return ResponseEntity.status(HttpStatus.OK).body("Activity added");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Activity can't be in the past");
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updateActivity(@RequestBody Activity activity, @PathVariable UUID id) {
        boolean updatePerformed = activityService.updateActivity(activity, id);
        if (updatePerformed) {
            return ResponseEntity.status(HttpStatus.OK).body("Activity updated");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No activity with requested id");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable UUID id) {
        boolean deletePerformed = activityService.deleteActivity(id);
        if (deletePerformed) {
            return ResponseEntity.status(HttpStatus.OK).body("Activity deleted");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No activity with requested id");
    }

    @PatchMapping("/unsubscribe-user/{userId}/{activityId}")
    public ResponseEntity<?> unsubscribeFromActivity(@PathVariable UUID userId, @PathVariable UUID activityId) {
        boolean isUnsubscribed = activityService.unsubscribeFromActivity(userId, activityId);
        if (isUnsubscribed) {
            return ResponseEntity.status(HttpStatus.OK).body("the user has signed out of the activity");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No activity with requested id");
    }
}
