import { User } from "@/model/userModel";

export interface UserRepository {
  Create(user: User): Promise<User>;
  Update(user: User): Promise<User>;
  Delete(id: string): Promise<void>;
  FindById(id: string): Promise<User | null>;
  FindByEmail(email: string): Promise<User | null>;
  FindByName(name: string): Promise<User | null>;
}
