const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  const MOCK_ISSUE_TITLE = "Test Issue";
  const MOCK_ISSUE_TEXT = "This is a test issue";
  const MOCK_CREATED_BY = "Test User";
  const MOCK_ASSIGNED_TO = "Assigned User";
  const DEFAULT_ASSIGNED_TO = "";
  const MOCK_STATUS_TEXT = "In Progress";
  const DEFAULT_STATUS_TEXT = "";
  
  suite("Testing POST requests", () => {
    test("Create an issue with every field: POST request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/mock-project")
        .send({
          issue_title: MOCK_ISSUE_TITLE,
          issue_text: MOCK_ISSUE_TEXT,
          created_by: MOCK_CREATED_BY,
          assigned_to: MOCK_ASSIGNED_TO,
          status_text: MOCK_STATUS_TEXT,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, MOCK_ISSUE_TITLE);
          assert.equal(res.body.issue_text, MOCK_ISSUE_TEXT);
          assert.equal(res.body.created_by, MOCK_CREATED_BY);
          assert.equal(res.body.assigned_to, MOCK_ASSIGNED_TO);
          assert.equal(res.body.status_text, MOCK_STATUS_TEXT);
          done();
        })
    });
    test("Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/mock-project")
        .send({
          issue_title: MOCK_ISSUE_TITLE,
          issue_text: MOCK_ISSUE_TEXT,
          created_by: MOCK_CREATED_BY
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, MOCK_ISSUE_TITLE);
          assert.equal(res.body.issue_text, MOCK_ISSUE_TEXT);
          assert.equal(res.body.created_by, MOCK_CREATED_BY);
          assert.equal(res.body.assigned_to, DEFAULT_ASSIGNED_TO);
          assert.equal(res.body.status_text, DEFAULT_STATUS_TEXT);
          done();
        });
    });
    test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/mock-project")
        .send({
          issue_title: MOCK_ISSUE_TITLE
        })
        .end((err, res) => {
          assert.equal(res.status, 200); // TODO: should this return 200? Or a 40x?
          assert.property(res.body, "error");
          assert.equal(res.body.error, "required field(s) missing.");
          done();
        })
    });
  });

  suite("Testing GET requests", () => {
    test("View issues on a project: GET request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .get("/api/issues/mock-project")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'Response should be an array');
        // should be nonzero array
        assert.isAtLeast(res.body.length, 1);
        done();
      });
    });
    test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .get("/api/issues/mock-project")
      .query({ issue_title: MOCK_ISSUE_TITLE })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'Response should be an array');
        // should be nonzero array
        assert.isAtLeast(res.body.length, 1);
        done();
      });
    });
    test("View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .get("/api/issues/mock-project")
      .query({
        issue_title: MOCK_ISSUE_TITLE,
        created_by: MOCK_CREATED_BY,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'Response should be an array');
        // should be nonzero array
        assert.isAtLeast(res.body.length, 1);
        done();
      });
    });
  });

  suite("Testing PUT requests", () => {
    test("Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
      // Create a new issue
      const newIssue = await createNewIssue({
        issue_title: "Title 1",
        issue_text: "Text 1",
        created_by: "User 1",
      });
      // Update one field (issue_text) on the issue
      chai
        .request(server)
        .put("/api/issues/mock-project")
        .send({
          _id: newIssue._id,
          issue_text: "Updated Text 1",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, newIssue._id);
          done();
        });
    });
    test("Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
      // Create a new issue
      const newIssue = await createNewIssue({
        issue_title: "Title 2",
        issue_text: "Text 2",
        created_by: "User 2",
      });
  
      // Update multiple fields (issue_title and issue_text) on the issue
      chai
        .request(server)
        .put("/api/issues/mock-project")
        .send({
          _id: newIssue._id,
          issue_title: "Updated Title 2",
          issue_text: "Updated Text 2",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, newIssue._id);
          done();
        });
      });
    test("Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
      // Attempt to update an issue without providing an _id
      chai
        .request(server)
        .put("/api/issues/mock-project")
        .send({
          issue_title: "Title 3",
          issue_text: "Text 3",
          created_by: "User 3",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
      // Create a new issue
      const newIssue = await createNewIssue({
        issue_title: "Title 4",
        issue_text: "Text 4",
        created_by: "User 4",
      });
  
      // Attempt to update an issue without providing any fields to update
      chai
        .request(server)
        .put("/api/issues/mock-project")
        .send({
          _id: newIssue._id,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, newIssue._id);
          done();
        });
    });
    test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
      chai
        .request(server)
        .put("/api/issues/mock-project")
        .send({
          _id: "invalid_id",
          issue_title: "Title 5",
          issue_text: "Text 5",
          created_by: "User 5",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "could not update");
          assert.equal(res.body._id, "invalid_id");
          done();
        });
    });
  });

  suite("Testing DELETE requests", () => {
    test("Delete an issue: DELETE request to /api/issues/{project}", (done) => {
      // Create a new issue
      const newIssue = await createNewIssue({
        issue_title: "Title 1",
        issue_text: "Text 1",
        created_by: "User 1",
      });
  
      // Delete the created issue
      chai
        .request(server)
        .delete("/api/issues/mock-project")
        .send({
          _id: newIssue._id,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, newIssue._id);
          done();
        });
    });
    test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
      // Attempt to delete an issue with an invalid _id
      chai
        .request(server)
        .delete("/api/issues/mock-project")
        .send({
          _id: "invalid_id",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "invalid_id");
          done();
        });
    });
    test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
      // Attempt to delete an issue without providing an _id
      chai
        .request(server)
        .delete("/api/issues/mock-project")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});
