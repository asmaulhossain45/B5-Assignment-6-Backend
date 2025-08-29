import HTTP_STATUS from "../constants/httpStatus";
import { Admin } from "../modules/admin/admin.model";
import { Agent } from "../modules/agent/agent.model";
import { User } from "../modules/user/user.model";
import AppError from "../utils/appError";

type Props = {
  email?: string;
  phone?: string;
};

const checkUniqueAccount = async ({ email, phone }: Props) => {
  let query: Record<string, string> = {};

  if (!email && !phone) return;

  if (email) {
    query.email = email.trim().toLowerCase();
  }

  if (phone) {
    query.phone = phone.trim();
  }

  const user = await User.findOne(query);
  if (user) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      `An account already exists with ${email || phone}.`
    );
  }

  const agent = await Agent.findOne(query);
  if (agent) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      `An account already exists with ${email || phone}.`
    );
  }

  const admin = await Admin.findOne(query);
  if (admin) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      `An account already exists with ${email || phone}.`
    );
  }
};

export default checkUniqueAccount;
