package com.empms.jms;

import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class EmployeeProducer {

    @Autowired
    private JmsTemplate jmsTemplate;

    public void sendEvent(Long id, String action) {
        String msg = """
        {
          "employeeId": %d,
          "action": "%s"
        }
        """.formatted(id, action);

        jmsTemplate.convertAndSend("employee.events", msg);
    }
}