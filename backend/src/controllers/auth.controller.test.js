import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRequire } from "module";

// Le contrôleur charge ses dépendances via require() (CommonJS). On les remplace
// dans le cache require AVANT de charger le contrôleur, afin de l'isoler
// complètement de MongoDB (modèle User) et de bcrypt.
const requireCjs = createRequire(import.meta.url);
const userPath = requireCjs.resolve("../models/User");
const bcryptPath = requireCjs.resolve("bcryptjs");

const mockUser = { findOne: vi.fn(), create: vi.fn() };
const mockBcrypt = { hash: vi.fn(), compare: vi.fn() };

requireCjs.cache[userPath] = { id: userPath, filename: userPath, loaded: true, exports: mockUser };
requireCjs.cache[bcryptPath] = { id: bcryptPath, filename: bcryptPath, loaded: true, exports: mockBcrypt };

const { register, login } = requireCjs("./auth.controller");

function makeReply() {
  return {
    statusCode: undefined,
    payload: undefined,
    status(code) { this.statusCode = code; return this; },
    send(body) { this.payload = body; return this; },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("controllers/auth.controller - register", () => {
  const body = { username: "alice", email: "alice@mail.com", password: "secret1", age: 25 };

  it("cree l'utilisateur et renvoie 201", async () => {
    mockUser.findOne.mockResolvedValue(null);
    mockBcrypt.hash.mockResolvedValue("hashed-pwd");
    mockUser.create.mockResolvedValue({ _id: "u1", email: "alice@mail.com" });

    const reply = makeReply();
    await register({ body }, reply);

    expect(mockUser.findOne).toHaveBeenCalledWith({
      $or: [{ email: "alice@mail.com" }, { username: "alice" }],
    });
    expect(mockBcrypt.hash).toHaveBeenCalledWith("secret1", 10);
    expect(mockUser.create).toHaveBeenCalledWith(
      expect.objectContaining({ username: "alice", password: "hashed-pwd", status: "pending" })
    );
    expect(reply.statusCode).toBe(201);
    expect(reply.payload).toEqual({
      success: true,
      message: "Utilisateur créé",
      data: { id: "u1", email: "alice@mail.com" },
    });
  });

  it("renvoie 409 si l'email ou le username existe deja", async () => {
    mockUser.findOne.mockResolvedValue({ _id: "existing" });
    const reply = makeReply();
    await register({ body }, reply);
    expect(reply.statusCode).toBe(409);
    expect(reply.payload.success).toBe(false);
    expect(mockUser.create).not.toHaveBeenCalled();
  });

  it("renvoie 500 en cas d'erreur serveur", async () => {
    mockUser.findOne.mockRejectedValue(new Error("db down"));
    const reply = makeReply();
    await register({ body }, reply);
    expect(reply.statusCode).toBe(500);
  });
});

describe("controllers/auth.controller - login", () => {
  const creds = { email: "alice@mail.com", password: "secret1" };
  function makeReq() {
    return { body: creds, server: { signJWT: vi.fn().mockResolvedValue("jwt-token") } };
  }

  it("connecte un utilisateur actif et renvoie un token", async () => {
    mockUser.findOne.mockResolvedValue({
      _id: { toString: () => "u1" },
      role: "user",
      username: "alice",
      status: "active",
      banned: false,
      password: "hashed-pwd",
    });
    mockBcrypt.compare.mockResolvedValue(true);

    const reply = makeReply();
    const req = makeReq();
    await login(req, reply);

    expect(req.server.signJWT).toHaveBeenCalledWith({ id: "u1", role: "user" });
    expect(reply.statusCode).toBe(200);
    expect(reply.payload.data.token).toBe("jwt-token");
    expect(reply.payload.data.user).toEqual({ username: "alice", role: "user" });
  });

  it("renvoie 401 si le mot de passe est incorrect", async () => {
    mockUser.findOne.mockResolvedValue({ password: "hashed-pwd", status: "active", banned: false });
    mockBcrypt.compare.mockResolvedValue(false);
    const reply = makeReply();
    await login(makeReq(), reply);
    expect(reply.statusCode).toBe(401);
  });

  it("renvoie 401 si l'utilisateur n'existe pas", async () => {
    mockUser.findOne.mockResolvedValue(null);
    const reply = makeReply();
    await login(makeReq(), reply);
    expect(reply.statusCode).toBe(401);
  });

  it("renvoie 403 si le compte est en attente de validation", async () => {
    mockUser.findOne.mockResolvedValue({ password: "hashed-pwd", status: "pending", banned: false });
    mockBcrypt.compare.mockResolvedValue(true);
    const reply = makeReply();
    await login(makeReq(), reply);
    expect(reply.statusCode).toBe(403);
  });

  it("renvoie 403 si le compte est banni", async () => {
    mockUser.findOne.mockResolvedValue({
      _id: { toString: () => "u1" },
      password: "hashed-pwd",
      status: "active",
      banned: true,
    });
    mockBcrypt.compare.mockResolvedValue(true);
    const reply = makeReply();
    await login(makeReq(), reply);
    expect(reply.statusCode).toBe(403);
  });
});
