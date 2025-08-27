type Props = {
  name?: string;
  otp: string;
  action: "Verify Account" | "Reset Password";
};

export const otpEmailTemplate = ({ name, otp, action }: Props) => `
  <div style="
    font-family: Arial, sans-serif; 
    background-color: #f5f5f5; 
    padding: 50px 0; 
    text-align: center;
  ">
    <div style="
      display: inline-block; 
      background-color: #ffffff; 
      padding: 30px; 
      border-radius: 8px; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      max-width: 300px;
      width: 90%;
    ">
      <h2 style="color: #ee4e1a; margin-bottom: 10px;">${action}</h2>
      <p>Hello, <strong>${name || "Sir"}</strong></p>
      <p>Use the following OTP to ${action.toLowerCase()}:</p>

      <p style="
        font-size: 32px; 
        font-weight: bold; 
        color: #1c273e; 
        letter-spacing: 4px; 
        margin: 20px 0;
      ">${otp}</p>

      <p>This OTP will expire in <strong>10 minutes</strong>.</p>
      <p style="font-size: 14px; color: #999;">If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
      <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Digital Wallet. All rights reserved.</p>
    </div>
  </div>
`;
