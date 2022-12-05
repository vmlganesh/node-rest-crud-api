var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
var dbConn = require("./dbconn");
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// default route
app.get("/", function (req, res) {
  return res.send({ error: true, message: "hello" });
});
dbConn.connect();
// Retrieve all users
app.get("/api/users", function (req, res) {
  console.log("/api/users");
  dbConn.query(
    "SELECT fti_employee.e_id, fti_employee.employee_id, fti_employee.t_id, fti_employee.e_first_name, fti_employee.e_last_name, fti_employee.e_second_name, fti_employee.e_dob, fti_employee.e_email_address, fti_employee.e_password, fti_employee.e_telephone, fti_employee.e_address, fti_employee.e_post_code, fti_employee.e_remaining_holiday, fti_employee.e_total_leave_points, fti_employee.right_work_uk, fti_employee.uk_evidence, fti_employee.e_status, fti_employee.employee_image,fti_employment_details.role_id, fti_employment_details.access_levels, fti_employment_details.office_id, fti_employment_details.managers_id, fti_employment_details.start_date, fti_employment_details.d_id, fti_employment_details.salary, fti_employee_role.role_name,fti_departments.department_name,fti_status_code.status_name FROM fti_employee JOIN fti_employment_details ON fti_employment_details.employee_id=fti_employee.employee_id JOIN fti_employee_role ON fti_employee_role.role_id=fti_employment_details.role_id JOIN fti_departments ON fti_departments.d_id=fti_employment_details.d_id JOIN fti_status_code ON fti_status_code.status_code=fti_employee.e_status where fti_employee.e_status <> 3 AND fti_employee.e_status <> 33 AND fti_employee.e_email_address <> '' ORDER BY fti_employee.e_first_name LIMIT 30",
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, data: results, message: "users list." });
    }
  );
});
// Retrieve user with id
app.get("/api/user/:id", function (req, res) {
  let user_id = req.params.id;
  if (!user_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide user_id" });
  }
  dbConn.query(
    "SELECT fti_employee.e_id, fti_employee.employee_id, fti_employee.t_id, fti_employee.e_first_name, fti_employee.e_last_name, fti_employee.e_second_name, fti_employee.e_dob, fti_employee.e_email_address, fti_employee.e_password, fti_employee.e_telephone, fti_employee.e_address, fti_employee.e_post_code, fti_employee.e_remaining_holiday, fti_employee.e_total_leave_points, fti_employee.right_work_uk, fti_employee.uk_evidence, fti_employee.e_status, fti_employee.employee_image,fti_employment_details.role_id, fti_employment_details.access_levels, fti_employment_details.office_id, fti_employment_details.managers_id, fti_employment_details.start_date, fti_employment_details.d_id, fti_employment_details.salary, fti_employee_role.role_name,fti_departments.department_name,fti_status_code.status_name FROM fti_employee JOIN fti_employment_details ON fti_employment_details.employee_id=fti_employee.employee_id JOIN fti_employee_role ON fti_employee_role.role_id=fti_employment_details.role_id JOIN fti_departments ON fti_departments.d_id=fti_employment_details.d_id JOIN fti_status_code ON fti_status_code.status_code=fti_employee.e_status where fti_employee.employee_id=?",
    user_id,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results[0],
        message: "users list.",
      });
    }
  );
});
// Add a new user
app.post("/api/user", function (req, res) {
  let user = req.body.user;
  if (!user) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide user" });
  }
  dbConn.query(
    "INSERT INTO users SET ? ",
    { user: user },
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "New user has been created successfully.",
      });
    }
  );
});
//  Update user with id
app.put("/api/user", function (req, res) {
  let user_id = req.body.user_id;
  let user = req.body.user;
  if (!user_id || !user) {
    return res
      .status(400)
      .send({ error: user, message: "Please provide user and user_id" });
  }
  dbConn.query(
    "UPDATE users SET user = ? WHERE id = ?",
    [user, user_id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "user has been updated successfully.",
      });
    }
  );
});
//  Delete user
app.delete("/api/user", function (req, res) {
  let user_id = req.body.user_id;
  if (!user_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide user_id" });
  }
  dbConn.query(
    "DELETE FROM users WHERE id = ?",
    [user_id],
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "User has been updated successfully.",
      });
    }
  );
});
// set port
app.listen(5000, function () {
  console.log("Node app is running on port 5000");
});
module.exports = app;
