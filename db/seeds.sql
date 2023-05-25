USE company_db;

INSERT INTO department (name) VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id) VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Account Manager', 160000, 3),
('Acountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES
('John', 'Doe', null, 1),
('Mike', 'Chan', null, 2),
('Ashley', 'Rodriguez', null, 3),
('Kunal', 'Singh', 1, 4),
('Malia', 'Brown', 4, 5),
('Sarah', 'Lourd', 1, 6),
('Tom', 'Allen', 2, 7),
('Kevin', 'Tupik', 3, 8);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;