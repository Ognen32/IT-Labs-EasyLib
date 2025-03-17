import { findUserById, createUser } from "../repositories/userRepository.js"

export const getUserById = async (id) => {
    const user = await findUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  };