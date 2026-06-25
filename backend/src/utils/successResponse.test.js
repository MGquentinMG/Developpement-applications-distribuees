const successResponse = require("./successResponse");

function makeReply() {
  return {
    statusCode: undefined,
    payload: undefined,
    status(code) { this.statusCode = code; return this; },
    send(body) { this.payload = body; return this; },
  };
}

describe("utils/successResponse", () => {
  it("enveloppe les données avec success:true, message et statut fournis", () => {
    const reply = makeReply();
    successResponse(reply, { id: 1 }, "Créé", 201);
    expect(reply.statusCode).toBe(201);
    expect(reply.payload).toEqual({ success: true, message: "Créé", data: { id: 1 } });
  });

  it("utilise le statut 200 et le message par défaut", () => {
    const reply = makeReply();
    successResponse(reply, { ok: true });
    expect(reply.statusCode).toBe(200);
    expect(reply.payload).toEqual({ success: true, message: "Succès", data: { ok: true } });
  });
});
