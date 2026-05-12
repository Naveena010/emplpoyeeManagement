package com.empms.service;

import com.empms.model.*;
import com.empms.jms.EmployeeProducer;
import com.empms.model.Employee;
import com.empms.repository.*;
import com.empms.validation.XMLValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Unmarshaller;

import java.io.StringReader;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repo;

    @Autowired
    private AuditLogRepository auditRepo;

    @Autowired
    private EmployeeProducer producer;

    @Autowired
    private XMLValidator validator;

    public Employee create(String xml) {
        validator.validate(xml);

        Employee emp = convertXMLToObject(xml);
        emp.setId(null);
        Employee saved = repo.save(emp);

        sendAndLog(saved.getId(), "CREATE");
        return saved;
    }

    public Employee update(Long id, Employee emp) {
        emp.setId(id);
        Employee updated = repo.save(emp);

        sendAndLog(id, "UPDATE");
        return updated;
    }

    public void delete(Long id) {
        repo.deleteById(id);
        sendAndLog(id, "DELETE");
    }

    public Employee getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public List<Employee> getAll() {
        return repo.findAll();
    }

    private Employee convertXMLToObject(String xml) {
        try {
            JAXBContext context = JAXBContext.newInstance(Employee.class);
            Unmarshaller unmarshaller = context.createUnmarshaller();
            return (Employee) unmarshaller.unmarshal(new StringReader(xml));
        } catch (Exception e) {
            throw new RuntimeException("XML Parsing Error", e);
        }
    }

    private void sendAndLog(Long id, String action) {
       // producer.sendEvent(id, action);

        if (producer != null) {
            producer.sendEvent(id, action);
        }

        AuditLog log = new AuditLog();
        log.setEmployeeId(id);
        log.setAction(action);
        log.setSource("REST");
        log.setTimestamp(LocalDateTime.now());

        auditRepo.save(log);
    }
}