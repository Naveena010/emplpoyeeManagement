package com.empms.service;

import com.empms.dto.*;
import com.empms.exception.*;
import com.empms.jms.EmployeeProducer;
import com.empms.model.*;
import com.empms.repository.*;
import com.empms.validation.XMLValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.xml.bind.JAXBContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository empRepo;
    private final AuditLogRepository auditRepo;
    private final EmployeeProducer   producer;
    private final XMLValidator       validator;
    private final ObjectMapper       objectMapper;

    public EmployeeResponseDTO create(String xml) {
        validator.validate(xml);
        var dto      = parseXml(xml);
        checkEmail(dto.getEmail(), null);
        checkDate(dto.getDateOfJoining());
        var saved    = empRepo.save(toEntity(dto));
        var response = toResponse(saved);
        log(saved.getId(), "CREATE", xml, toJson(response), "Employee created");
        return response;
    }

    public EmployeeResponseDTO update(Long id, EmployeeRequestDTO dto) {
        var emp = getActive(id);
        checkEmail(dto.getEmail(), id);
        checkDate(dto.getDateOfJoining());
        emp.setName(dto.getName());
        emp.setEmail(dto.getEmail());
        emp.setDepartment(dto.getDepartment());
        emp.setDateOfJoining(LocalDate.parse(dto.getDateOfJoining()));
        emp.setPhone(dto.getPhone());
        emp.setDesignation(dto.getDesignation());
        emp.setSalary(dto.getSalary());
        var response = toResponse(empRepo.save(emp));
        log(id, "UPDATE", toJson(dto), toJson(response), "Employee updated");
        return response;
    }

    public void delete(Long id) {
        var emp = getActive(id);
        emp.setStatus("INACTIVE");
        empRepo.save(emp);
        log(id, "DELETE",
                "{ \"employeeId\": " + id + " }",
                "{ \"message\": \"Employee " + id + " set to INACTIVE\" }",
                "Employee deleted");
    }

    public EmployeeResponseDTO getById(Long id) {
        return toResponse(empRepo.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id)));
    }

    public List<EmployeeResponseDTO> getAll() {
        return empRepo.findAll().stream().map(this::toResponse).toList();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Employee getActive(Long id) {
        var emp = empRepo.findById(id).orElseThrow(() -> new EmployeeNotFoundException(id));
        if (!"ACTIVE".equals(emp.getStatus())) throw new InactiveEmployeeException(id);
        return emp;
    }

    private void checkEmail(String email, Long excludeId) {
        boolean exists = excludeId == null
                ? empRepo.existsByEmail(email)
                : empRepo.existsByEmailAndIdNot(email, excludeId);
        if (exists) throw new DuplicateEmailException(email);
    }

    private void checkDate(String date) {
        if (LocalDate.parse(date).isAfter(LocalDate.now()))
            throw new InvalidDateOfJoiningException(date);
    }

    private EmployeeRequestDTO parseXml(String xml) {
        try {
            return (EmployeeRequestDTO) JAXBContext.newInstance(EmployeeRequestDTO.class)
                    .createUnmarshaller().unmarshal(new StringReader(xml));
        } catch (Exception e) {
            throw new InvalidXmlException(e.getMessage());
        }
    }

    private Employee toEntity(EmployeeRequestDTO dto) {
        var emp = new Employee();
        emp.setName(dto.getName());
        emp.setEmail(dto.getEmail());
        emp.setDepartment(dto.getDepartment());
        emp.setDateOfJoining(LocalDate.parse(dto.getDateOfJoining()));
        emp.setPhone(dto.getPhone());
        emp.setDesignation(dto.getDesignation());
        emp.setSalary(dto.getSalary());
        return emp;
    }

    private EmployeeResponseDTO toResponse(Employee e) {
        return EmployeeResponseDTO.builder()
                .id(e.getId()).name(e.getName()).email(e.getEmail())
                .department(e.getDepartment()).dateOfJoining(e.getDateOfJoining())
                .phone(e.getPhone()).designation(e.getDesignation()).salary(e.getSalary())
                .status(e.getStatus()).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt())
                .build();
    }

    private String toJson(Object obj) {
        try { return objectMapper.writeValueAsString(obj); }
        catch (Exception e) { return "{}"; }
    }

    private void log(Long id, String action, String request, String response, String remarks) {
        producer.sendEvent(id, action);

        String username = "SYSTEM";
        String role     = "UNKNOWN";
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            username = auth.getName();
            role     = auth.getAuthorities().iterator().next().getAuthority();
        } catch (Exception ignored) {}

        AuditLog log = new AuditLog();
        log.setEmployeeId(id);
        log.setUsername(username);
        log.setRole(role);
        log.setAction(action);
        log.setSource("REST");
        log.setRequest(request);
        log.setResponse(response);
        log.setRemarks(remarks);
        log.setTimestamp(LocalDateTime.now());
        auditRepo.save(log);
    }
}