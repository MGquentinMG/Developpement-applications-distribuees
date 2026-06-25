const authPlugin = require("./auth.middleware");

function makeReply() {
  return {
    statusCode: undefined,
    payload: undefined,
    status(code) { this.statusCode = code; return this; },
    send(body) { this.payload = body; return this; },
  };
}

// Récupère le handler "authenticate" décoré par le plugin sur une fausse instance Fastify.
async function getAuthenticate() {
  let handler;
  const fastify = {
    decorate(name, fn) { if (name === "authenticate") handler = fn; },
  };
  await authPlugin(fastify);
  return handler;
}

describe("middlewares/auth.middleware - authenticate", () => {
  it("decore bien une fonction authenticate", async () => {
    const authenticate = await getAuthenticate();
    expect(typeof authenticate).toBe("function");
  });

  it("laisse passer quand le JWT est valide", async () => {
    const authenticate = await getAuthenticate();
    const reply = makeReply();
    const request = { jwtVerify: vi.fn().mockResolvedValue(undefined) };
    await authenticate(request, reply);
    expect(request.jwtVerify).toHaveBeenCalled();
    expect(reply.statusCode).toBeUndefined();
  });

  it("renvoie 401 quand le JWT est invalide ou absent", async () => {
    const authenticate = await getAuthenticate();
    const reply = makeReply();
    const request = { jwtVerify: vi.fn().mockRejectedValue(new Error("bad token")) };
    await authenticate(request, reply);
    expect(reply.statusCode).toBe(401);
    expect(reply.payload).toEqual({
      success: false,
      message: "Non autorisé : Token invalide ou absent",
    });
  });
});
