import User from '../models/userModel.js';
import catchAsyncError from '../middlewares/catchAsyncError.js';

export const findUserByUsername = catchAsyncError(async (username) => {
  return await User.findOne({ where: { username } });
});

export const findUserByEmail = async (email) => {
  return await User.findOne({
    where: { email },
    attributes: ['id', 'username', 'email', 'password', 'roles', 'firstName', 'surname', 'dateOfBirth', 'gender', 'country', 'city', 'address'],
  });
};

export const createUser = async ({ username, firstName, surname, email, password, dateOfBirth, gender, country, city, address, roles }) => {
  return await User.create({ username, firstName, surname, email, password, dateOfBirth, gender, country, city, address, roles });
};