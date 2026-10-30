import { graphqlRequest } from "./graphqlClient";

const FORGOT_PASSWORD_MUTATION = `
  mutation ForgotPassword($email: String!) {
    forgotPassword(input: { email: $email }) {
      success
      message
      error
    }
  }
`;

const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($email: String!, $token: String!, $newPassword: String!, $confirmPassword: String!) {
    resetPassword(input: {
      email: $email, token: $token,
      newPassword: $newPassword, confirmPassword: $confirmPassword
    }) {
      success
      message
      error
    }
  }
`;

type ActionPayload = {
  success: boolean;
  message: string | null;
  error: string | null;
};

export async function forgotPassword(email: string): Promise<string> {
  const res = await graphqlRequest<{ forgotPassword: ActionPayload }>(
    FORGOT_PASSWORD_MUTATION,
    { email }
  );
  const p = res.forgotPassword;
  if (!p.success) throw new Error(p.error ?? p.message ?? "Request nahi ho saki");
  return p.message ?? "Reset link bhej diya gaya hai.";
}

export async function resetPassword(vars: {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<string> {
  const res = await graphqlRequest<{ resetPassword: ActionPayload }>(
    RESET_PASSWORD_MUTATION,
    vars
  );
  const p = res.resetPassword;
  if (!p.success) throw new Error(p.error ?? p.message ?? "Password reset nahi ho saka");
  return p.message ?? "Password badal diya gaya.";
}