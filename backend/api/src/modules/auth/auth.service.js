import bcrypt from 'bcrypt'
import { User } from '../../models/user.model.js'

export async function createUser({ username, email, password }, queues) {
  // 1. Vérifier si l'email ou le username existe déjà
  const existing = await User.findOne({
    $or: [{ email }, { username }]
  })

  if (existing) {
    const field = existing.email === email ? 'email' : 'username'
    const error = new Error(`${field} already taken`)
    error.statusCode = 409
    throw error
  }

  // 2. Hacher le mot de passe
  const hashed = await bcrypt.hash(password, 12)

  // 3. Créer l'utilisateur en base
  const user = await User.create({
    username,
    email,
    password: hashed
  })

  // 4. Envoyer un job BullMQ pour l'email de bienvenue
  await queues.email.add(
    'welcome-email',
    { userId: user._id.toString(), email: user.email, username: user.username },
    { attempts: 3, backoff: { type: 'exponential', delay: 2000 } }
  )

  return user
}