package com.empms.repository;

import com.empms.model.AuditLog;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class AuditLogRepositoryTest {

    @Autowired
    private AuditLogRepository repo;

    @Test
    void testSaveAuditLog() {
        var log = new AuditLog();
        log.setEmployeeId(1L);
        log.setAction("CREATE");
        log.setSource("TEST");
        log.setTimestamp(LocalDateTime.now());

        var saved = repo.save(log);
        assertNotNull(saved.getId());
    }

    @Test
    void testFindAllLogs() {
        long before = repo.count();

        var log1 = new AuditLog();
        log1.setEmployeeId(1L); log1.setAction("CREATE");
        log1.setSource("TEST"); log1.setTimestamp(LocalDateTime.now());

        var log2 = new AuditLog();
        log2.setEmployeeId(2L); log2.setAction("DELETE");
        log2.setSource("TEST"); log2.setTimestamp(LocalDateTime.now());

        repo.save(log1); repo.save(log2);

        assertTrue(repo.count() >= before + 2);
    }
}