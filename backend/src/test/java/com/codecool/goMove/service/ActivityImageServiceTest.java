package com.codecool.goMove.service;

import com.codecool.goMove.config.ApplicationConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ActivityImageServiceTest {

    @InjectMocks
    private ActivityImageService activityImageService;

    @Mock
    private ApplicationConfig applicationConfig;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetImage() throws IOException {
        when(applicationConfig.getActivityPhotoFolder()).thenReturn("/path/to/photo/folder");

        String fileId = String.valueOf(UUID.randomUUID());
        Path folderPath = Paths.get("/path/to/photo/folder");
        Path filePath = folderPath.resolve(fileId);

        byte[] imageData = "Test image data".getBytes();

        Files.createDirectories(folderPath);

        Files.write(filePath, imageData);

        try {
            byte[] retrievedData = activityImageService.getImage(fileId);

            assertNotNull(retrievedData);
            assertArrayEquals(imageData, retrievedData);
        } finally {
            Files.delete(filePath);
            Files.deleteIfExists(folderPath);
        }
    }

    @Test
    void testGetImageWithNonExistentFile() {
        when(applicationConfig.getActivityPhotoFolder()).thenReturn("/path/to/photo/folder");

        String fileId = "nonexistentfile";
        byte[] retrievedData = activityImageService.getImage(fileId);

        assertNull(retrievedData);
    }

    @Test
    void testRemoveImageWithNullFileId() {
        boolean removed = activityImageService.removeImage(null);

        assertTrue(removed);
    }

}