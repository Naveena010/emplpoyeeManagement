package com.empms.jms;

import com.empms.model.AuditLog;
import com.empms.repository.AuditLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class EmployeeConsumerTest {

    @Mock
    private AuditLogRepository auditRepo;

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
