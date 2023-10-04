package com.codecool.goMove.service;

import com.codecool.goMove.config.ApplicationConfig;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ActivityImageService implements ImageService {

    ApplicationConfig applicationConfig;

    public ActivityImageService(ApplicationConfig applicationConfig) {
        this.applicationConfig = applicationConfig;
    }

    @Override
    public String uploadImage(byte[] fileData) throws IOException {
        String fileId = String.valueOf(UUID.randomUUID());
        Path path = Paths.get(applicationConfig.getActivityPhotoFolder(), fileId);
        Files.write(path, fileData);
        return  fileId;
    }

    @Override
    public boolean removeImage(String fileId) {
        if (fileId == null) return true;
        Path path = Paths.get(applicationConfig.getActivityPhotoFolder(), fileId);
        try {
            Files.delete(path);
        } catch (IOException exception) {
            //TODO log something
            return false;
        }
        return true;
    }

    @Override
    public byte[] getImage(String fileId) {
        Path path = Paths.get(applicationConfig.getActivityPhotoFolder(), fileId);
        try {
            return Files.readAllBytes(path);
        } catch (IOException e) {
            return null;
        }
    }
}
