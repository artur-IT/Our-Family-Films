import bcrypt from "bcrypt";

// Number of salt rounds for password hashing
// Higher number = more secure but slower (10 is a good balance)
const SALT_ROUNDS = 10;

/**
 * This function should be used when creating or updating user passwords
 * @param password - The plain text password to hash
 * @returns A promise that resolves to the hashed password string
 */
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

