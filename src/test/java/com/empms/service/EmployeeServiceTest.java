package com.empms.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.empms.model.Employee;
import com.empms.model.AuditLog;
import com.empms.repository.EmployeeRepository;
import com.empms.repository.AuditLogRepository;
import com.empms.jms.EmployeeProducer;
import com.empms.validation.XMLValidator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock private EmployeeRepository repo;
    @Mock private AuditLogRepository auditRepo;
    @Mock private EmployeeProducer producer;
    @Mock private XMLValidator validator;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    void testCreateEmployee_Success() {
        String xml = "<Employee><name>John Doe</name></Employee>";
        Employee emp = new Employee();
        emp.setName("John Doe");

        Employee savedEmp = new Employee();
        savedEmp.setId(1L);
        savedEmp.setName("John Doe");

        // Stubs
        doNothing().when(validator).validate(anyString());
        when(repo.save(any(Employee.class))).thenReturn(savedEmp);

        // Execute
        Employee result = employeeService.create(xml);

        // Verify
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(validator).validate(xml);
        verify(repo).save(any(Employee.class));
        verify(auditRepo).save(any(AuditLog.class));
        verify(producer).sendEvent(1L, "CREATE");
    }

    @Test
    void testGetById_Success() {
        Employee emp = new Employee();
        emp.setId(1L);
        when(repo.findById(1L)).thenReturn(Optional.of(emp));

        Employee result = employeeService.getById(1L);

        assertEquals(1L, result.getId());
    }
}