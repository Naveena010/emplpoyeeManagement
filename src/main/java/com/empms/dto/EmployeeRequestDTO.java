package com.empms.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;

@Data
@XmlRootElement(name = "Employee")
@XmlAccessorType(XmlAccessType.FIELD)
public class EmployeeRequestDTO {
    private String name;
    private String email;
    private String department;
    private String dateOfJoining;
    private String phone;
    private String designation;
    private Double salary;
}