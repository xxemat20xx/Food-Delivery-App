export const VerifyEmail = ({ otp }) => (
  <div>
    <h2>Email Verification</h2>
    <p>Your verification code:</p>
    <h1>{otp}</h1>
    <p>This code expires in 10 minutes.</p>
  </div>
);
