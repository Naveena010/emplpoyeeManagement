package com.empms.dto;

import com.empms.jms.EmployeeConsumer;
import com.empms.model.AuditLog;
import com.empms.repository.AuditLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmployeeConsumerTest {

    @Mock
    private AuditLogRepository auditRepo;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private EmployeeConsumer consumer;

    @Test
    void testReceiveMessage() {
        String jsonMessage = """
                {
                  "employeeId": 101,
                  "action": "CREATE"
                }
                """;

        consumer.receive(jsonMessage);

        verify(auditRepo).save(any(AuditLog.class));
    }
}