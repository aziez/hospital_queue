// Langkah 6: Buat User Model di app/models/user.server.ts
import { prisma } from "~/utils/db.server";
import bcrypt from "bcryptjs";
import type { User, UserRole } from "~/types";

export type CreateUserInput = {
  username: string;
  password: string;
  role: UserRole;
  department?: string;
};

export async function createUser({
  username,
  password,
  role,
  department,
}: CreateUserInput): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
      department,
    },
  });

  return result as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await prisma.user.findUnique({
    where: { id },
  });

  return result as User | null;
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  const result = await prisma.user.findUnique({
    where: { username },
  });

  return result as User | null;
}

export async function verifyLogin(
  username: string,
  password: string
): Promise<User | null> {
  const user = await getUserByUsername(username);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}
