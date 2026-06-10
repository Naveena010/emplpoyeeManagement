package com.empms.jms;

import lombok.RequiredArgsConstructor;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmployeeProducer {

    private final JmsTemplate jmsTemplate;

    public void sendEvent(Long id, String action) {
        String msg = """
                { "employeeId": %d, "action": "%s" }
                """.formatted(id, action);
        jmsTemplate.convertAndSend("employee.events", msg);
    }
}