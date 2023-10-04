package com.codecool.goMove.service;

import com.codecool.goMove.config.ApplicationConfig;

import java.io.IOException;

public interface ImageService {

    public String uploadImage(byte[] fileData) throws IOException;
    public boolean removeImage(String fileId);
    public byte[] getImage(String fileId);
}
