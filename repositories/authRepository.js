import User from '../models/userModel.js';
// Defining the attributes from the userModel
const commonAttributes = ['id', 'userName', 'email', 'phoneNumber', 'firstName', 'surName', 'password', 'role', 'dateOfBirth', 'city', 'address'];

export const findUserById = async  function (userid) {
  try {
    return await User.findOne({where: {id: userid},
    attributes: ["id", "firstName", "surName", "userName", "avatar", "limit", "issueDate", "expirationDate", "role" ]
  })
  } catch (err) {
    throw new Error(err.message);
  }
}; 

export const findUserByUserName = async (userName) => {
  try {
    return await User.findOne({ where: { userName } }); // Checks if the username already exists
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findUserByEmail = async (email) => { // Checks if the email already exists if it does it checks for their existing attributes
  try {
    return await User.findOne({ where: { email }, attributes: commonAttributes });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findUserByPhoneNumber = async (phoneNumber) => { // Checks if the phone number already exists if it does it checks for their existing attributes
  try {
    return await User.findOne({ where: { phoneNumber }, attributes: commonAttributes });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createUser = async (userData) => { // Creates and stores the new user in the DB
  try {
    return await User.create(userData);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findUserByResetPasswordToken = async (resetPasswordToken) => {
  try {
    return await User.findOne({ where: { resetPasswordToken } });
  } catch (error) {
    throw new Error(error.message); // For matching the hashed tokens but does not work
  }
};

// Updates the user's password reset token and expiry time
export const updateUserPassword = async (userId, newPassword) => {
  try {
    return await User.update(
      { password: newPassword },
      { where: { id: userId } }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};