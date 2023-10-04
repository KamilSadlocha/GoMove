package com.codecool.goMove.auth;

import com.codecool.goMove.config.JwtService;
import com.codecool.goMove.model.Role;
import com.codecool.goMove.model.User;
import com.codecool.goMove.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Test
    void testRegister_SuccessfulRegistration() {
        RegisterRequest registerRequest = new RegisterRequest("testuser", "test@example.com", "password");
        User newUser = new User();
        newUser.setUserName(registerRequest.getUsername());
        newUser.setUserEmail(registerRequest.getEmail());
        newUser.setPassword("encodedPassword");
        newUser.setRole(Role.USER);

        when(userRepository.existsByUserNameOrUserEmail(any(), any())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        lenient().when(jwtService.generateToken(Mockito.eq(newUser))).thenReturn("testToken");

        AuthenticationResponse response = authenticationService.register(registerRequest);

        assertNotNull(response);

        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode(registerRequest.getPassword());
    }

    @Test
    void testAuthenticate_SuccessfulAuthentication() {
        AuthenticationRequest authenticationRequest = new AuthenticationRequest("testuser", "password");
        User user = new User();
        user.setUserName(authenticationRequest.getUsername());
        user.setPassword("encodedPassword");

        when(userRepository.findByUserName(authenticationRequest.getUsername())).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(jwtService.generateToken(user)).thenReturn("testToken");

        AuthenticationResponse response = authenticationService.authenticate(authenticationRequest);

        assertNotNull(response);
        assertEquals("testToken", response.getToken());

        verify(userRepository, times(1)).findByUserName(authenticationRequest.getUsername());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, times(1)).generateToken(user);
    }
}