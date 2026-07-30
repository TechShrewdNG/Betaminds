/**
 * Creates the first admin account from the environment.
 *
 * Content is *not* seeded: every page's defaults live in
 * src/lib/content/defaults.ts and are merged in at read time, so the site shows
 * the full handoff copy on an empty database. A Document row only appears once
 * somebody saves an edit.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME ?? "Betaminds Admin";

  if (!email || !password) {
    console.error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding. See .env.example.",
    );
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} already exists — leaving the password alone.`);
    return;
  }

  await prisma.adminUser.create({
    data: { email, name, passwordHash: await bcrypt.hash(password, 10) },
  });

  console.log(`Created admin ${email}.`);
  console.log("Sign in at /admin/login, then change the password under Password.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
