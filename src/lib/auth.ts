import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 * This function should be used during login to verify user credentials
 * @param plainPassword - The plain text password from user input
 * @param hashedPassword - The hashed password stored in the database
 * @returns A promise that resolves to true if passwords match, false otherwise
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

