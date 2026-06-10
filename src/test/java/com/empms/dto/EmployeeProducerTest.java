package com.empms.dto;

import com.empms.jms.EmployeeProducer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jms.core.JmsTemplate;

import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmployeeProducerTest {

    @Mock
    private JmsTemplate jmsTemplate;

    @InjectMocks
    private EmployeeProducer producer;

    @Test
    void testSendEvent() {
        producer.sendEvent(101L, "UPDATE");


        verify(jmsTemplate).convertAndSend(
                eq("employee.events"),
                contains("101")
        );
    }
}