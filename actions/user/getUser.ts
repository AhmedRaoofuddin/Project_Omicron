"use server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismaDb";

export async function getUser() {
  try {
    const user = await currentUser();

    if (!user) {
      return;
    }

    const shop = await prisma.shops.findUnique({
      where: {
        userId: user.id,
      },
    });

    return { user, shop };
  } catch (error) {
    console.log("load user error", error);
  }
}
