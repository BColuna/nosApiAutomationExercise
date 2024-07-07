describe("todo spec", () => {
  it("schema check", () => {
    const schema = {
      title: "todo schema",
      type: "object",
      required: ["id", "user_id", "title", "due_on", "status"],
      properties: {
        id: { type: "number" },
        user_id: { type: "number" },
        title: { type: "string" },
        due_on: { type: "string" },
        status: { type: "string" },
      },
    };
    cy.request("/todos").then((response) =>
      response.body.forEach((todo) => {
        expect(todo).to.be.jsonSchema(schema);
        const dateRegex =
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}([+-]\d{2}:\d{2}|Z)$/;
        expect(todo.due_on).to.match(dateRegex);
        const statusRegex = /^(completed|pending)$/;
        expect(todo.status).to.match(statusRegex);
      })
    );
  });

  it.skip("all completed - will fail", () => {
    cy.request("/todos").then((response) =>
      response.body.forEach((todo) => {
        const statusRegex = /completed/i;
        expect(todo.status).to.match(statusRegex);
      })
    );
  });

  it("due on valid", () => {
    cy.request("/todos").then((response) =>
      response.body.forEach((todo) => {
        const today = new Date();
        const dueOn = Date.parse(todo.due_on);
        today > dueOn
          ? expect(todo.status).to.match(/complete/i)
          : expect(todo.status).to.match(/^(completed|pending)$/);
      })
    );
  });
});
