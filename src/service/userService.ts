import { toUserResponse } from "@/helper/responseHelper";
import { SignInRequest, SignUpRequest } from "@/model/requestModel";
import { SignInResponse } from "@/model/responseModel";
import { User } from "@/model/userModel";
import { UserRepository } from "@/repository/userRepository";
import { UserValidation } from "@/validation/userValidation";
import { HTTPException } from "hono/http-exception";
import { randomUUIDv7 } from "bun";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(request: SignUpRequest): Promise<User> {
    request = (await UserValidation.SIGNUP.parse(request)) as SignUpRequest;

    const existingUserByName = await this.userRepository.FindByName(
      request.name
    );

    if (existingUserByName) {
      throw new HTTPException(400, { message: "Name already exist" });
    }

    const user: User = {
      id: randomUUIDv7(),
      name: request.name,
      email: request.email,
      emailVerified: false,
      image: request.image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await this.userRepository.Create(user);
    } catch (err: any) {
      if (err.code === "23505") {
        throw new HTTPException(400, {
          message: "Email already exist",
        });
      }
      throw err;
    }
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.FindById(userId);

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    return user;
  }
}
