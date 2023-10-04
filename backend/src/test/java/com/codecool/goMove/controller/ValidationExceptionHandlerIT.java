package com.codecool.goMove.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
class ValidationExceptionHandlerIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testHandleValidationExceptions() throws Exception {
        String jsonRequest = "{\"fieldName1\": \"value1\", \"fieldName2\": \"value2\"}";

        mockMvc.perform(MockMvcRequestBuilders.patch("/users/update/invalid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
   }

    @Test
    public void testHandleConstraintViolationException() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/users/invalid"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
   }
}