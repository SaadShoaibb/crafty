import { auth } from "@clerk/nextjs/server";
import prismadb from "./prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
  const { userId } = auth();  // Make sure this uses lowercase 'd'

  if (!userId) {
    return;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,  // Use 'userId' here
    },
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId: userId },  // Use 'userId' here
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: 1 },  // Use 'userId' here
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();  // Make sure this uses lowercase 'd'

  if (!userId) {
    return false;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,  // Use 'userId' here
    },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};
