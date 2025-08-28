import { User } from "../modules/user/user.model";
import { Agent } from "../modules/agent/agent.model";
import { Admin } from "../modules/admin/admin.model";
import AppError from "./appError";
import HTTP_STATUS from "../constants/httpStatus";

const isEmailTaken = async (rawEmail: string) => {
  const email = rawEmail.trim().toLowerCase();

  const user = await User.findOne({ email });
  if (user) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists."
    );
  }

  const agent = await Agent.findOne({ email });
  if (agent) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists."
    );
  }

  const admin = await Admin.findOne({ email });
  if (admin) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      "An account with this email already exists."
    );
  }
};

export default isEmailTaken;
