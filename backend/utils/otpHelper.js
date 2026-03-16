import crypto from "crypto";

// generate secure OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// hash OTP using SHA256
export const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
