// Import inquirer
const inquirer = require('inquirer');
// Import mysql
const mysql = require('mysql2');
// Import console.table
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username
    user: 'root',
    // MySQL password
    password: 'root',
    database: 'company_db'
  },
  console.log(`Connected to the company database.`)
);


start();

function start() {
  // Call inquirer to ask the users what they want to do
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'menu',
        choices: ['View all Departments', 'View all Roles', 'View all Employees',
          'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
      }
    ])
    .then((answers) => {
      console.log(answers.menu);
      switch (answers.menu) {
        case 'View all Departments':
          viewAllDepatments();
          break;

        case 'View all Roles':
          viewAllRoles();
          break;

        case 'View all Employees':
          viewAllEmployees();
          break;

        case 'Add a Department':
          addDepartment();
          break;

        case 'Add an Employee':
          addEmployee();
          break;

        case 'Add a Role':
          addRole();
          break;

        case 'Update an Employee Role':
          updateEmployee();
          break;

      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// Query database to show all departments in the table
function viewAllDepatments() {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results);
    start();
  });
}

// Query database to show all roles in the table
function viewAllRoles() {
  db.query('SELECT * FROM role', function (err, results) {
    console.table(results);
    start();
  });
}

// Query database to show all employees in the table
function viewAllEmployees() {
  db.query('SELECT * FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
    console.table(results);
    start();
  });
}

// Query database to insert new department into the table
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'department_name',
    }
  ])
    .then((answers) => {
      db.query('INSERT INTO department(name) VALUES(?)', answers.department_name, function (err, results) {
        console.table(results);
        start();
      })
    })
}

// Query database to insert new role into the table
function addRole() {
  // Query database to grab all departments and map each one into there own array
  db.query('SELECT * FROM department', (err, results) => {
    let departName = results.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });

    inquirer.prompt([
      {
        type: 'input',
        message: 'What is the name of the role?',
        name: 'role_name',
      },
      {
        type: 'input',
        message: 'What is the salary of the role?',
        name: 'role_salary',
      },
      {
        type: 'list',
        message: 'What department does the role belong to?',
        name: 'department_name',
        choices: departName
      }
    ])
      .then((answers) => {
        db.query('INSERT INTO role SET ?',
          {
            title: answers.role_name,
            salary: answers.role_salary,
            department_id: answers.department_name
          },
          function (err) {
            if (err) throw err;
          }
        );
        viewAllRoles()
      });
  });
};

// Query database to insert new employee into the table
function addEmployee() {
  // Query database to grab all roles and map each one into there own array
  db.query('SELECT * FROM role', (err, results) => {
    let roleName = results.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });

    inquirer.prompt([
      {
        type: 'input',
        message: 'What is the employees first name?',
        name: 'first_name',
      },
      {
        type: 'input',
        message: 'What is the employees last name?',
        name: 'last_name',
      },
      {
        type: 'input',
        message: 'What is there manager id number?',
        name: 'manager_id',
      },
      {
        type: 'list',
        message: 'What role is the employee in?',
        name: 'role',
        choices: roleName
      }
    ])
      .then((answers) => {
        db.query('INSERT INTO employee SET ?',
          {
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: answers.role,
            manager_id: answers.manager_id
          },
          function (err) {
            if (err) throw err;
          }
        );
        viewAllEmployees()
      });
  });
};

// Query database to update a current employee from the table
function updateEmployee() {
  // Query database to grab all employees and map each one into there own array
  db.query('SELECT * FROM employee', (err, results) => {
    let employeeName = results.map((employee) => {
      return {
        name: employee.first_name,
        value: employee.id,
      };
    });

    // Query database to grab all roles and map each one into there own array
    db.query('SELECT * FROM role', (err, results) => {
      let roleName = results.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });

      inquirer.prompt([
        {
          type: 'list',
          message: 'Name of employee?',
          name: 'name',
          choices: employeeName
        },
        {
          type: 'list',
          message: 'What is the new role?',
          name: 'newRole',
          choices: roleName
        }
      ])
        .then((answers) => {
          db.query('UPDATE employee SET ? WHERE ?',
            [
              {
                role_id: answers.newRole
              },
              {
                id: answers.name
              },
            ],
            function (err) {
              if (err) throw err;
            }
          );
          viewAllEmployees()
        });
    });
  });
};