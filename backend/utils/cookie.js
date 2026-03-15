// export const cookieOptions = {
//   httpOnly: true,
//   secure: true,
//   sameSite: "none",
// };
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};
