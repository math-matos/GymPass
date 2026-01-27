import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { RegisterUseCase } from '../../use-cases/register.js'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUserCase = new RegisterUseCase(prismaUsersRepository)

    await registerUserCase.execute({
      name,
      email,
      password,
    })
  } catch (error) {
    return reply.status(409).send({
      message: 'Email already exists.',
    })
  }

  return reply.status(201).send()
}
