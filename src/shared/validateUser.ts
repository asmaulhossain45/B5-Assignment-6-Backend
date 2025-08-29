import { UserRole } from "../constants/enums";
import HTTP_STATUS from "../constants/httpStatus";
import { IAdmin } from "../modules/admin/admin.interface";
import { Admin } from "../modules/admin/admin.model";
import { IAgent } from "../modules/agent/agent.interface";
import { Agent } from "../modules/agent/agent.model";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import AppError from "../utils/appError";

const validateUser = async (email: string, role: UserRole) => {
  let account = null;

  switch (role) {
    case UserRole.USER:
      account = await User.findOne({ email: email.toLowerCase() });
      break;
    case UserRole.AGENT:
      account = await Agent.findOne({ email: email.toLowerCase() });
      break;
    case UserRole.ADMIN:
      account = await Admin.findOne({ email: email.toLowerCase() });
      break;
    default:
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid role.");
  }

  if (!account) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, `${role} not found.`);
  }

  if (!account.isVerified) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, `${role} is not verified.`);
  }

  if (account.status !== "active") {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      `${role} is ${account.status}.`
    );
  }

  const agentAccount = account as IAgent;
  if (role === UserRole.AGENT) {
    if (!agentAccount.isApproved) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, `${role} is not approved.`);
    }
  }

  return account;
};

export default validateUser;
