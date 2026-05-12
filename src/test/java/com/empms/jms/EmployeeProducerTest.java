package com.empms.jms;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jms.core.JmsTemplate;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class EmployeeProducerTest {

    @Mock
    private JmsTemplate jmsTemplate;

    @InjectMocks
    private EmployeeProducer producer;

    @Test
    void testSendEvent() {

        producer.sendEvent(101L, "UPDATE");

        String expectedMsg = """
            {
              "employeeId": 101,
              "action": "UPDATE"
            }
            """;

        verify(jmsTemplate).convertAndSend("employee.events", expectedMsg);
    }
}
