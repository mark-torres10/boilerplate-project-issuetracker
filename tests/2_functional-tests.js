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
        })
    });
  });
});
