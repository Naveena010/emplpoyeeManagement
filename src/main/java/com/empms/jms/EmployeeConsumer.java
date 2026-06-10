package com.empms.jms;

import com.empms.model.AuditLog;
import com.empms.repository.AuditLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmployeeConsumer {

    private final AuditLogRepository auditRepo;
    private final ObjectMapper       objectMapper;

    @JmsListener(destination = "employee.events")
    public void receive(String msg) {
        try {
            Map<String, Object> event = objectMapper.readValue(msg, Map.class);

            var log = new AuditLog();
            log.setEmployeeId(((Number) event.get("employeeId")).longValue());
            log.setAction((String) event.get("action"));
            log.setSource("JMS");
            log.setRequest(msg);                          // raw JMS message as request
            log.setResponse("Event consumed successfully");
            log.setTimestamp(LocalDateTime.now());
            log.setRemarks("Received from employee.events queue");
            auditRepo.save(log);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}