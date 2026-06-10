package com.empms.repository;

import com.empms.model.Employee;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;


import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository repo;

    @Test
    void testSaveEmployee() {
        var emp = new Employee();
        emp.setName("John");
        emp.setEmail("john_test_" + System.currentTimeMillis() + "@test.com"); // unique email
        emp.setDepartment("IT");
        emp.setDateOfJoining(LocalDate.of(2024, 1, 1));

        var saved = repo.save(emp);
        assertNotNull(saved.getId());
    }

    @Test
    void testFindById() {
        var emp = new Employee();
        emp.setName("Alice");
        emp.setEmail("alice_" + System.currentTimeMillis() + "@test.com");
        emp.setDepartment("HR");
        emp.setDateOfJoining(LocalDate.of(2023, 1, 1));

        var saved = repo.save(emp);
        var found = repo.findById(saved.getId()).orElse(null);

        assertNotNull(found);
        assertEquals("Alice", found.getName());
    }

    @Test
    void testFindAll() {
        long before = repo.count();

        var e1 = new Employee();
        e1.setName("User1"); e1.setEmail("u1_" + System.currentTimeMillis() + "@test.com");
        e1.setDepartment("IT"); e1.setDateOfJoining(LocalDate.of(2024, 1, 1));

        var e2 = new Employee();
        e2.setName("User2"); e2.setEmail("u2_" + System.currentTimeMillis() + "@test.com");
        e2.setDepartment("HR"); e2.setDateOfJoining(LocalDate.of(2023, 1, 1));

        repo.save(e1); repo.save(e2);

        assertTrue(repo.count() >= before + 2);
    }

    @Test
    void testDeleteEmployee() {
        var emp = new Employee();
        emp.setName("DeleteTest"); emp.setEmail("del_" + System.currentTimeMillis() + "@test.com");
        emp.setDepartment("IT"); emp.setDateOfJoining(LocalDate.of(2024, 1, 1));

        var saved = repo.save(emp);
        repo.deleteById(saved.getId());

        assertFalse(repo.findById(saved.getId()).isPresent());
    }

    @Test
    void testExistsByEmail() {
        String email = "exists_" + System.currentTimeMillis() + "@test.com";
        var emp = new Employee();
        emp.setName("Test"); emp.setEmail(email);
        emp.setDepartment("IT"); emp.setDateOfJoining(LocalDate.of(2024, 1, 1));
        repo.save(emp);

        assertTrue(repo.existsByEmail(email));
        assertFalse(repo.existsByEmail("notexist@test.com"));
    }
}