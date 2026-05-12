package com.empms.jms;

import com.empms.model.AuditLog;
import com.empms.repository.AuditLogRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Component
public class EmployeeConsumer {

    private final AuditLogRepository auditRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public EmployeeConsumer(AuditLogRepository auditRepo) {
        this.auditRepo = auditRepo;
    }

    @JmsListener(destination = "employee.events")
    public void receive(String msg) {

        try {
            // ✅ Parse JSON string into Map
            Map<String, Object> event =
                    objectMapper.readValue(msg, new TypeReference<>() {});

            Long employeeId =
                    ((Number) event.get("employeeId")).longValue();

            String action = (String) event.get("action");

            // ✅ Save audit log
            AuditLog log = new AuditLog();
            log.setEmployeeId(employeeId);   // ✅ FIX
            log.setAction(action);
            log.setSource("JMS");
            log.setTimestamp(LocalDateTime.now());

            auditRepo.save(log);

            System.out.println("Received: " + msg);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
