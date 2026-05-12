package com.empms.validation;

import org.springframework.stereotype.Component;
import javax.xml.XMLConstants;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.SchemaFactory;
import java.io.StringReader;

@Component
public class XMLValidator {

    public void validate(String xml) {
        try {
            SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            var schema = factory.newSchema(new StreamSource(getClass().getResourceAsStream("/employee.xsd")));

            var validator = schema.newValidator();
            validator.validate(new StreamSource(new StringReader(xml)));

        } catch (Exception e) {
            throw new RuntimeException("Invalid XML: " + e.getMessage());
        }
    }
}