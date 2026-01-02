import { authMiddleware } from "@/middleware/auth.middleware";
import { UpdateUserRequest } from "@/model/requestModel";
import { UserRepositoryImpl } from "@/repository/userRepositoryImpl";
import { UserService } from "@/service/userService";
import { Hono } from "hono";

export const userController = new Hono();
const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);

userController.get("/me", authMiddleware, async (c) => {
  const authUser = c.get("user");

  const user = await userService.getUserById(authUser.id);

  return c.json({
    data: user,
  });
});

userController.patch("/me", authMiddleware, async (c) => {
  const authUser = c.get("user");

  const body = (await c.req.json()) as UpdateUserRequest;

  const updatedUser = await userService.update(authUser.id, {
    name: body.name,
    image: body.image,
  });

  return c.json({
    data: updatedUser,
  });
});
