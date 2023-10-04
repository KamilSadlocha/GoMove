package com.codecool.goMove.controller;

import com.codecool.goMove.model.User;
import com.codecool.goMove.service.ImageService;
import com.codecool.goMove.service.UserImageService;
import com.codecool.goMove.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserImageService imageService;


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id) {
        User userById = userService.getUserById(id);
        if (userById == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with requested id");

        }

        if (userById.getPhotoName() != null && !userById.getPhotoName().isEmpty()) {
            userById.setUserPhoto(imageService.getImage(userById.getPhotoName()));
        }

        return ResponseEntity.status(HttpStatus.OK).body(userById);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getUserByName(@PathVariable String name) {
        User userByName = userService.getUserByName(name);
        if (userByName == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with requested name");
        }

        if (userByName.getPhotoName() != null && !userByName.getPhotoName().isEmpty()) {
            userByName.setUserPhoto(imageService.getImage(userByName.getPhotoName()));
        }

        return ResponseEntity.status(HttpStatus.OK).body(userByName);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@RequestBody User user, @PathVariable UUID id) {
        boolean updatePerformed = userService.updateUser(user, id);
        if (updatePerformed) {
            return ResponseEntity.status(HttpStatus.OK).body("User updated");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with requested id");
    }

    @PatchMapping("/enroll/{userId}/{activityId}")
    public ResponseEntity<?> enrollUser(@PathVariable UUID userId, @PathVariable UUID activityId) {
        boolean enrollPerformed = userService.enrollUser(userId, activityId);
        if (enrollPerformed) {
            return ResponseEntity.status(HttpStatus.OK).body("User enrolled to the activity");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user with requested id");
    }
}
