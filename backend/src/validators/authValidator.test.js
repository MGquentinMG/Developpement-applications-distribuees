const { validateRegister, validateLogin } = require("./authValidator");

function makeReply() {
  return {
    statusCode: undefined,
    payload: undefined,
    status(code) { this.statusCode = code; return this; },
    send(body) { this.payload = body; return this; },
  };
}

describe("validators/authValidator - validateRegister", () => {
  const valid = { username: "alice", email: "alice@mail.com", password: "secret1", age: 25 };

  it("laisse passer un corps valide (ne touche pas à reply)", async () => {
    const reply = makeReply();
    const result = await validateRegister({ body: valid }, reply);
    expect(result).toBeUndefined();
    expect(reply.statusCode).toBeUndefined();
    expect(reply.payload).toBeUndefined();
  });

  it("rejette un email invalide avec un 400", async () => {
    const reply = makeReply();
    await validateRegister({ body: { ...valid, email: "pas-un-email" } }, reply);
    expect(reply.statusCode).toBe(400);
    expect(reply.payload.success).toBe(false);
  });

  it("rejette un username trop court (< 3)", async () => {
    const reply = makeReply();
    await validateRegister({ body: { ...valid, username: "ab" } }, reply);
    expect(reply.statusCode).toBe(400);
  });

  it("rejette un age inferieur a 15", async () => {
    const reply = makeReply();
    await validateRegister({ body: { ...valid, age: 10 } }, reply);
    expect(reply.statusCode).toBe(400);
  });

  it("rejette un mot de passe trop court (< 6)", async () => {
    const reply = makeReply();
    await validateRegister({ body: { ...valid, password: "123" } }, reply);
    expect(reply.statusCode).toBe(400);
  });
});

describe("validators/authValidator - validateLogin", () => {
  it("laisse passer email + password valides", async () => {
    const reply = makeReply();
    const result = await validateLogin({ body: { email: "a@b.com", password: "secret1" } }, reply);
    expect(result).toBeUndefined();
    expect(reply.statusCode).toBeUndefined();
  });

  it("rejette un password trop court avec un 400", async () => {
    const reply = makeReply();
    await validateLogin({ body: { email: "a@b.com", password: "123" } }, reply);
    expect(reply.statusCode).toBe(400);
  });
});
