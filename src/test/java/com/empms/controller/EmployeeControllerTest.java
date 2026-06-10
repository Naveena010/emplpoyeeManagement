package com.empms.controller;

import com.empms.dto.EmployeeResponseDTO;
import com.empms.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeeController.class)
@AutoConfigureMockMvc(addFilters = false)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeService service;

    @MockBean
    private com.empms.security.JwtUtil jwtUtil;

    @MockBean
    private com.empms.security.JwtFilter jwtFilter;

    @Test
    void shouldGetEmployeeById() throws Exception {

        var dto = EmployeeResponseDTO.builder()
                .id(1L)
                .name("John Smith")
                .email("john@test.com")
                .department("IT")
                .status("ACTIVE")
                .dateOfJoining(LocalDate.of(2024, 1, 1))
                .build();

        when(service.getById(1L)).thenReturn(dto);

        mockMvc.perform(get("/employees/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Smith"));
    }

    @Test
    void shouldCreateEmployeeFromXml() throws Exception {
        String xml = """
                <Employee>
                  <name>John Smith</name>
                  <email>john@test.com</email>
                  <department>IT</department>
                  <dateOfJoining>2024-01-01</dateOfJoining>
                </Employee>""";

        var dto = EmployeeResponseDTO.builder()
                .id(10L)
                .name("John Smith")
                .build();

        when(service.create(xml)).thenReturn(dto);

        mockMvc.perform(post("/employees")
                        .contentType(MediaType.APPLICATION_XML)
                        .content(xml))
                .andExpect(status().isCreated());
    }
}