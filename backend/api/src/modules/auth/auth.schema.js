// Schémas de validation JSON Schema (natif Fastify)

export const registerSchema = {
  body: {
    type: 'object',
    required: ['username', 'email', 'password'],
    additionalProperties: false,
    properties: {
      username: { type: 'string', minLength: 3, maxLength: 30 },
      email:    { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id:       { type: 'string' },
            username: { type: 'string' },
            email:    { type: 'string' }
          }
        }
      }
    }
  }
}