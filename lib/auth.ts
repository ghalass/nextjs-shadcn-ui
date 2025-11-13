import bcrypt from "bcryptjs";

const KEY_LENGTH = 64;
export async function hashPassword(password: string) {
  console.log("#################");

  const salt = await bcrypt.genSalt(KEY_LENGTH); // génère le salt
  const hash = await bcrypt.hash(password, salt); // hash du mot de passe
  return { salt, hash };
}
