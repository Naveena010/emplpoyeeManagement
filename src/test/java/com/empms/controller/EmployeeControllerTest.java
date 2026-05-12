package com.empms.controller;

import com.empms.model.Employee;
import com.empms.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeService service;

    @Test
    void shouldGetEmployeeById() throws Exception {
        // 1. Setup Mock Data
        Employee mockEmp = new Employee();
        mockEmp.setId(1L);
        mockEmp.setName("John Smith");

        when(service.getById(1L)).thenReturn(mockEmp);

        // 2. Perform Request and Assert Response
        mockMvc.perform(get("/employees/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Smith"));
    }

    @Test
    void shouldCreateEmployeeFromXml() throws Exception {
        // 1. Setup Mock Data
        String xmlInput = "<Employee><name>John Smith</name></Employee>";
        Employee savedEmp = new Employee();
        savedEmp.setId(10L);
        savedEmp.setName("John Smith");

        when(service.create(xmlInput)).thenReturn(savedEmp);

        // 2. Perform Request and Assert Response
        mockMvc.perform(post("/employees")
                        .contentType(MediaType.APPLICATION_XML)
                        .content(xmlInput))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }
}