package com.empms.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class EmployeeResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String department;
    private LocalDate dateOfJoining;
    private String phone;
    private String designation;
    private Double salary;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}