import {
  SignUpUserRequest,
  UpdateUserProfileRequest,
  UpdateUserRequest,
} from "@/model/requestModel";
import { User } from "@/model/userModel";
import { UserRepository } from "@/repository/userRepository";
import { UserValidation } from "@/validation/userValidation";
import { HTTPException } from "hono/http-exception";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(request: SignUpUserRequest): Promise<User> {
    request = (await UserValidation.SIGNUP.parse(request)) as SignUpUserRequest;

    const existingUserByName = await this.userRepository.FindByName(
      request.name
    );

    if (existingUserByName) {
      throw new HTTPException(400, { message: "Name already exist" });
    }

    const user: User = {
      id: request.id,
      name: request.name,
      email: request.email,
      emailVerified: false,
      image: request.image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.userRepository.Create(user);
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.FindById(userId);

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    return user;
  }

  async update(
    userId: string,
    request: UpdateUserProfileRequest
  ): Promise<User> {
    const user = await this.userRepository.FindById(userId);
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    if (request.name && request.name !== user.name) {
      const existingUserByName = await this.userRepository.FindByName(
        request.name
      );

      if (existingUserByName) {
        throw new HTTPException(400, { message: "Name already exist" });
      }
    }

    const updatedUser: User = {
      ...user,
      name: request.name ?? user.name,
      image: request.image ?? user.image,
      updatedAt: new Date(),
    };

    return await this.userRepository.Update(updatedUser);
  }
}
