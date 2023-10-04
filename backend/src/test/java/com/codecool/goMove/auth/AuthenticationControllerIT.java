package com.codecool.goMove.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationService authenticationService;

    @Test
    void testRegister_SuccessfulRegistration() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("testuser", "test@example.com", "password");
        AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
                .token("testToken")
                .userId(UUID.randomUUID())
                .build();

        when(authenticationService.register(registerRequest)).thenReturn(authenticationResponse);
        String jsonResponse = objectMapper.writeValueAsString(registerRequest);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonResponse))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("testToken"));

        verify(authenticationService, times(1)).register(registerRequest);
    }

    @Test
    void testRegister_UserExists() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("testuser", "test@example.com", "password");

        when(authenticationService.register(registerRequest)).thenReturn(null);
        String jsonResponse = objectMapper.writeValueAsString(registerRequest);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonResponse))
                .andExpect(status().isBadRequest());

        verify(authenticationService, times(1)).register(registerRequest);
    }

    @Test
    void testAuthenticate_SuccessfulAuthentication() throws Exception {
        AuthenticationRequest authenticationRequest = new AuthenticationRequest("testuser", "password");
        AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
                .token("testToken")
                .userId(UUID.randomUUID())
                .build();

        when(authenticationService.authenticate(authenticationRequest)).thenReturn(authenticationResponse);
        String jsonResponse = objectMapper.writeValueAsString(authenticationRequest);

        mockMvc.perform(post("/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonResponse))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("testToken"));

        verify(authenticationService, times(1)).authenticate(authenticationRequest);
    }

}