import argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import passwordGenerator from 'generate-password'
import { createError } from './index'

import prisma from './prisma'

/**
 * @desc Returns a random string of 32 characters in hexadecimal
 * @info Can be used to create a secret
 */
export function makeRandomString32(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * @desc Hashes a password or any string using Argon 2
 * @param password Unhashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password)
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })
  }
}

/**
 * @desc Makes a uuid
 */
export function makeUuid(): string {
  return uuidv4()
}

/**
 * @Desc Generates a new password for user given user's uuid
 * @param uuid User's uuid
 * @returns {Promise<Error|string>} Returns generated password or error
 */
export async function generateNewPassword(
  uuid: string,
): Promise<Error | string> {
  // Generate secure password consistent with password policy
  const password = passwordGenerator.generate({
    length: 20,
    numbers: true,
    symbols: true,
    strict: true,
  })

  // Check if password passes password policy
  try {
    const isValidPassword = validatePassword(password)
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    })
  }
  // Hash password
  try {
    const errorOrHashedPassword = await hashPassword(password)
    const hashedPassword = errorOrHashedPassword as string

    // Update database
    await prisma.user.update({
      where: {
        uuid: uuid,
      },
      data: {
        password: hashedPassword,
      },
    })
    return password
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }
}

/**
 * @desc Verifies password against a hash
 * @param hash Hashed password
 * @param password Unhashed password
 */
export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    if (await argon2.verify(hash, password)) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    return false
  }
}

export function validatePassword(password: string): boolean {
  // Has at least 8 characters
  if (password.length < 8) return false

  // Has uppercase letters
  if (!/[A-Z]/.test(password)) return false

  // Has lowercase letters
  if (!/[a-z]/.test(password)) return false

  // Has numbers
  if (!/\d/.test(password)) return false

  // Has non-alphanumeric characters
  if (!/\W/.test(password)) return false

  return true
}
