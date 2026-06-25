const errorResponse = require("./errorResponse");

// Faux objet "reply" Fastify : status() est chaînable et send() capture le corps.
function makeReply() {
  return {
    statusCode: undefined,
    payload: undefined,
    status(code) { this.statusCode = code; return this; },
    send(body) { this.payload = body; return this; },
  };
}

describe("utils/errorResponse", () => {
  it("renvoie le message et le code de statut fournis", () => {
    const reply = makeReply();
    errorResponse(reply, "Champ invalide", 400);
    expect(reply.statusCode).toBe(400);
    expect(reply.payload).toEqual({ success: false, error: "Champ invalide" });
  });

  it("applique les valeurs par défaut (500 + message générique)", () => {
    const reply = makeReply();
    errorResponse(reply);
    expect(reply.statusCode).toBe(500);
    expect(reply.payload).toEqual({ success: false, error: "Une erreur est survenue" });
  });
});
