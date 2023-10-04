package com.codecool.goMove.service;

import com.codecool.goMove.config.ApplicationConfig;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UserImageService implements ImageService{

    ApplicationConfig applicationConfig;

    public UserImageService(ApplicationConfig applicationConfig) {
        this.applicationConfig = applicationConfig;
    }

    public String uploadImage(byte[] fileData) throws IOException {
        String fileId = String.valueOf(UUID.randomUUID());
        Path path = Paths.get(applicationConfig.getUserPhotoFolder(), fileId);
        Files.write(path, fileData);
        return  fileId;
    }

    public boolean removeImage(String fileId) {
        if (fileId == null) return true;
        Path path = Paths.get(applicationConfig.getUserPhotoFolder(), fileId);
        try {
            Files.delete(path);
        } catch (IOException exception) {
            //TODO log something
            return false;
        }
        return true;
    }

    public byte[] getImage(String fileId) {
        Path path = Paths.get(applicationConfig.getUserPhotoFolder(), fileId);
        try {
            return Files.readAllBytes(path);
        } catch (IOException e) {
            return null;
        }
    }
}
