import User from "../models/userModel.js";

export const findUserLimit = async function (userid) {
  try {
    const user = await User.findOne({
      where: {
        id: userid,
      },
    });
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateUserLimit = async function (userid, num) {
  try {
    // Decrease or increase by num
    const [updatedRows] = await User.increment("limit", {
      by: num,
      where: { id: userid },
    });
    return updatedRows;
  } catch (err) {
    throw new Error(err.message);
  }
};
