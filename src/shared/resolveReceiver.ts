import getAccount from "./getAccount";
import validateUser from "./validateUser";

export const resolveReceiver = async (
  emailOrPhone: string,
  message: string
) => {
  const isEmail = emailOrPhone.includes("@");

  const account = await getAccount({
    email: isEmail ? emailOrPhone : undefined,
    phone: !isEmail ? emailOrPhone : undefined,
    message,
  });

  await validateUser(account.email, account.role);

  return account;
};
