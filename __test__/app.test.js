const request = require("supertest");
const app = require("../app");

const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

describe("Log in API", () => {
    test("login existing user successfully", async () => {
        await new Promise((r) => setTimeout(r, 2000));

        const body = {
            Email: "user1@example.com",
            Password: "user1",
        };
        const response = await request(app)
            .post(`/api/login`)
            .send(body)
            .set(headers)
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body.Email).toEqual("user1@example.com");
    });

    test("login non-existing user failed", async () => {
        const body = {
            Email: "test@example.com",
            Password: "user1",
        };
        const response = await request(app)
            .post(`/api/login`)
            .send(body)
            .set(headers)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toEqual({ error: "no user" });
    });

    test("login wrong password", async () => {
        const body = {
            Email: "user1@example.com",
            Password: "user2",
        };
        const response = await request(app)
            .post(`/api/login`)
            .send(body)
            .set(headers)
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toEqual({ error: "No Match" });
    });
});

describe("Create Employee in API", () => {
    test("throw 403 error if no token", async () => {
        const body = {
            name: "test1",
            salary: "90000",
            currency: "USD",
            on_contract: "true",
            department: "Banking",
            sub_department: "Loan",
        };
        const response = await request(app)
            .post(`/api/employee`)
            .send(body)
            .set(headers)
            .expect(403);
        expect(response.body).toEqual({
            error: "A token is required for authentication",
        });
    });
    test("throw 401 error if no token", async () => {
        const body = {
            name: "test1",
            salary: "90000",
            currency: "USD",
            on_contract: "true",
            department: "Banking",
            sub_department: "Loan",
        };
        const response = await request(app)
            .post(`/api/employee`)
            .send(body)
            .set("authorization", "invalid")
            .set(headers)
            .expect(401);
        expect(response.body).toEqual({ error: "Invalid Token" });
    });

    test("create employee successfully", async () => {
        const body = {
            name: "test1",
            salary: "90000",
            currency: "USD",
            on_contract: "true",
            department: "Banking",
            sub_department: "Loan",
        };
        const response = await request(app)
            .post(`/api/employee`)
            .send(body)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(201);
        expect(response.body.message).toEqual("success");
    });

    test("create employee failed if salary is string", async () => {
        const body = {
            name: "test1",
            salary: "abc",
            currency: "USD",
            on_contract: "true",
            department: "Banking",
            sub_department: "Loan",
        };
        const response = await request(app)
            .post(`/api/employee`)
            .send(body)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toEqual({ error: "salary should be number" });
    });

    test("create employee failed if name is missing", async () => {
        const body = {
            salary: "10000",
            currency: "USD",
            on_contract: "true",
            department: "Banking",
            sub_department: "Loan",
        };
        const response = await request(app)
            .post(`/api/employee`)
            .send(body)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toEqual({ error: "name is missing" });
    });

    test("create employee failed if salary is missing", async () => {
        const body = {
            name: "john",
            currency: "USD",
            on_contract: "true",
            department: "Banking",
            sub_department: "Loan",
        };
        const response = await request(app)
            .post(`/api/employee`)
            .send(body)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toEqual({
            error: "salary is missing,salary should be number",
        });
    });

    test("create employee failed if currency is missing", async () => {
        const body = {
            salary: "10000",
            name: "John",
            on_contract: "true",
            department: "Banking",
            sub_department: "Loan",
        };
        const response = await request(app)
            .post(`/api/employee`)
            .send(body)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toEqual({ error: "currency is missing" });
    });

    test("create employee failed if on_contract is missing", async () => {
        const body = {
            salary: "10000",
            currency: "USD",
            name: "John",
            department: "Banking",
            sub_department: "Loan",
        };
        const response = await request(app)
            .post(`/api/employee`)
            .send(body)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toEqual({
            error: "on_contract is missing,on_contract should be 'true' or 'false'",
        });
    });

    test("create employee failed if department is missing", async () => {
        const body = {
            salary: "10000",
            currency: "USD",
            on_contract: "true",
            name: "Banking",
            sub_department: "Loan",
        };
        const response = await request(app)
            .post(`/api/employee`)
            .send(body)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toEqual({ error: "department is missing" });
    });

    test("create employee failed if sub_department is missing", async () => {
        const body = {
            salary: "10000",
            currency: "USD",
            on_contract: "true",
            department: "Banking",
            name: "Loan",
        };
        const response = await request(app)
            .post(`/api/employee`)
            .send(body)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toEqual({ error: "sub_department is missing" });
    });
});

describe("Delete Employee in API", () => {
    test("delete employee successfully", async () => {
        const response = await request(app)
            .delete(`/api/employee/10`)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body.message).toEqual("success");
    });

    test("delete employee failed", async () => {
        const response = await request(app)
            .delete(`/api/employee/100000`)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(400);
        expect(response.body).toEqual({ error: "does not exist" });
    });
});

describe("searchbysalary in API", () => {
    test("searchbysalary successfully", async () => {
        const response = await request(app)
            .post(`/api/employee/searchbysalary`)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body).toEqual({
            message: "success",
            data: [
                {
                    max: 200000000,
                    mean: 22295010,
                    min: 30,
                },
            ],
        });
    });
});

describe("searchbycontract in API", () => {
    test("searchbycontract successfully", async () => {
        const response = await request(app)
            .post(`/api/employee/searchbycontract`)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body).toEqual({
            message: "success",
            data: [
                {
                    mean: 100000,
                    min: 90000,
                    max: 110000,
                },
            ],
        });
    });
});

describe("searchbydepartment in API", () => {
    test("searchbydepartment successfully", async () => {
        const response = await request(app)
            .post(`/api/employee/searchbydepartment`)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body).toEqual({
            message: "success",
            data: [
                {
                    mean: 30,
                    min: 30,
                    max: 30,
                    department: "Administration",
                },
                {
                    mean: 90000,
                    min: 90000,
                    max: 90000,
                    department: "Banking",
                },
                {
                    mean: 40099006,
                    min: 30,
                    max: 200000000,
                    department: "Engineering",
                },
                {
                    mean: 35015,
                    min: 30,
                    max: 70000,
                    department: "Operations",
                },
            ],
        });
    });
});

describe("searchbysubdepartment in API", () => {
    test("searchbysubdepartment successfully", async () => {
        const response = await request(app)
            .post(`/api/employee/searchbysubdepartment`)
            .set(headers)
            .set("authorization", "apitesttoken")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body).toEqual({
            message: "success",
            data: [
                {
                    mean: 30,
                    min: 30,
                    max: 30,
                    department: "Administration",
                    sub_department: "Agriculture",
                },
                {
                    mean: 90000,
                    min: 90000,
                    max: 90000,
                    department: "Banking",
                    sub_department: "Loan",
                },
                {
                    mean: 200000000,
                    min: 200000000,
                    max: 200000000,
                    department: "Engineering",
                    sub_department: "Devops",
                },
                {
                    mean: 123757.5,
                    min: 30,
                    max: 240000,
                    department: "Engineering",
                    sub_department: "Platform",
                },
                {
                    mean: 35015,
                    min: 30,
                    max: 70000,
                    department: "Operations",
                    sub_department: "CustomerOnboarding",
                },
            ],
        });
    });
});
