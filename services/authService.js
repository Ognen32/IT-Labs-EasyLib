import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByEmail, createUser } from "../repositories/userRepository.js"

export const registerUser = async (username, email, password) => {
    const existingUser = await findByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    return await createUser({ username, email, password: hashedPassword });
};


export const authenticateUser = async (email, password) => {
    const user = await findByEmail(email); 
    
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }
  
    const token = generateToken(user);
  
    return token;
  };

  export const generateToken = (user) => {
    return jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );
  };