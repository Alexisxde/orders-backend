import "dotenv/config";
import prisma from "../src/services/prisma";

async function main() {
  /* =======================
    USER
  ======================= */
  const user = await prisma.user.upsert({
    where: { email: "user@user.com" },
    update: {},
    create: {
      name: "User",
      email: "user@user.com",
      password: "$2b$10$fW6dSP9Nw2mUvpFdA0J0LOGCHH4CMqgSUK88qXzfaXOjB7CiFFUoW",
    },
  });
  console.log("✅ Usuario creado");

  /* =======================
    AVATAR
  ======================= */
  const avatar = await prisma.avatar.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      cloudId: "dcbjswtbrziln4awz4a9",
      url: "https://res.cloudinary.com/dzfntog8k/image/upload/v1762300789/dcbjswtbrziln4awz4a9.jpg",
      user: {
        connect: { id: user.id },
      },
    },
  });
  console.log("✅ Avatar creado");

  await prisma.user.update({
    where: { id: user.id },
    data: { avatarId: avatar.id },
  });
  console.log("✅ Avatar asignado al usuario");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
