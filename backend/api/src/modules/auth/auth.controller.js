import { createUser } from './auth.service.js'

export async function register(req, reply) {
  const { username, email, password } = req.body

  const user = await createUser(
    { username, email, password },
    req.server.queues   // on passe les queues BullMQ au service
  )

  return reply.status(201).send({
    message: 'Account created',
    user: {
      id:       user._id,
      username: user.username,
      email:    user.email
    }
  })
}