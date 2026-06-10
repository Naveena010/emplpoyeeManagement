package com.empms.service;

import com.empms.dto.EmployeeResponseDTO;
import com.empms.exception.EmployeeNotFoundException;
import com.empms.jms.EmployeeProducer;
import com.empms.model.AuditLog;
import com.empms.model.Employee;
import com.empms.repository.AuditLogRepository;
import com.empms.repository.EmployeeRepository;
import com.empms.validation.XMLValidator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock private EmployeeRepository    repo;
    @Mock private AuditLogRepository    auditRepo;
    @Mock private EmployeeProducer      producer;
    @Mock private XMLValidator          validator;

    @InjectMocks
    private EmployeeService employeeService;



    @Test
    void testCreate_Success() {
        String xml = """
                <Employee>
                  <name>John Doe</name>
                  <email>john@test.com</email>
                  <department>IT</department>
                  <dateOfJoining>2024-01-01</dateOfJoining>
                </Employee>""";

        var saved = new Employee();
        saved.setId(1L);
        saved.setName("John Doe");
        saved.setEmail("john@test.com");
        saved.setDepartment("IT");
        saved.setDateOfJoining(LocalDate.of(2024, 1, 1));
        saved.setStatus("ACTIVE");

        doNothing().when(validator).validate(anyString());
        when(repo.existsByEmail(anyString())).thenReturn(false);
        when(repo.save(any(Employee.class))).thenReturn(saved);
        when(auditRepo.save(any(AuditLog.class))).thenReturn(new AuditLog());

        EmployeeResponseDTO result = employeeService.create(xml);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        verify(validator).validate(anyString());
        verify(repo).save(any(Employee.class));
        verify(auditRepo).save(any(AuditLog.class));
        verify(producer).sendEvent(1L, "CREATE");
    }



    @Test
    void testGetById_Success() {
        var emp = new Employee();
        emp.setId(1L);
        emp.setName("Alice");
        emp.setEmail("alice@test.com");
        emp.setDepartment("HR");
        emp.setDateOfJoining(LocalDate.of(2023, 1, 1));
        emp.setStatus("ACTIVE");

        when(repo.findById(1L)).thenReturn(Optional.of(emp));

        EmployeeResponseDTO result = employeeService.getById(1L);

        assertEquals(1L, result.getId());
        assertEquals("Alice", result.getName());
    }

    @Test
    void testGetById_NotFound() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EmployeeNotFoundException.class, () -> employeeService.getById(99L));
    }



    @Test
    void testGetAll() {
        var e1 = new Employee();
        e1.setId(1L); e1.setName("A"); e1.setEmail("a@test.com");
        e1.setDepartment("IT"); e1.setDateOfJoining(LocalDate.now()); e1.setStatus("ACTIVE");

        var e2 = new Employee();
        e2.setId(2L); e2.setName("B"); e2.setEmail("b@test.com");
        e2.setDepartment("HR"); e2.setDateOfJoining(LocalDate.now()); e2.setStatus("ACTIVE");

        when(repo.findAll()).thenReturn(List.of(e1, e2));

        List<EmployeeResponseDTO> result = employeeService.getAll();

        assertEquals(2, result.size());
    }



    @Test
    void testDelete_SetsInactive() {
        var emp = new Employee();
        emp.setId(1L); emp.setName("Del"); emp.setEmail("del@test.com");
        emp.setDepartment("IT"); emp.setDateOfJoining(LocalDate.now()); emp.setStatus("ACTIVE");

        when(repo.findById(1L)).thenReturn(Optional.of(emp));
        when(repo.save(any())).thenReturn(emp);
        when(auditRepo.save(any())).thenReturn(new AuditLog());

        employeeService.delete(1L);

        assertEquals("INACTIVE", emp.getStatus());
        verify(repo).save(emp);
        verify(producer).sendEvent(1L, "DELETE");
    }
}