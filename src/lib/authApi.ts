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
  mutation ResetPassword($email: String!, $token: String!, $newPassword: String!, $confirmNewPassword: String!) {
    resetPassword(input: {
      email: $email, token: $token,
      newPassword: $newPassword, confirmNewPassword: $confirmNewPassword
    }) {
      success
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
  if (!p.success) throw new Error(p.error ?? p.message ?? "Request could not be processed");
  return p.message ?? "Reset link has been sent.";
}

export async function resetPassword(vars: {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<string> {
  const res = await graphqlRequest<{
    resetPassword: { success: boolean; error: string | null };
  }>(RESET_PASSWORD_MUTATION, {
    email: vars.email,
    token: vars.token,
    newPassword: vars.newPassword,
    confirmNewPassword: vars.confirmPassword,
  });
  const p = res.resetPassword;
  if (!p.success) throw new Error(p.error ?? "Password could not be reset.");
  return "Password has been reset.";
}