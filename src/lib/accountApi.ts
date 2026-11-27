import { graphqlRequest } from "./graphqlClient";

export interface MyProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
}

export async function fetchMyProfile(): Promise<MyProfile | null> {
  const res = await graphqlRequest<{ myProfile: MyProfile | null }>(
    `query MyProfile { myProfile { firstName lastName email phoneNumber } }`
  );
  return res.myProfile;
}

export async function updateProfileApi(input: {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
}): Promise<void> {
  const res = await graphqlRequest<{ updateProfile: { success: boolean; error: string | null } }>(
    `mutation UpdateProfile($input: UpdateProfileInput!) {
       updateProfile(input: $input) { success error }
     }`,
    { input }
  );
  if (!res.updateProfile.success) {
    throw new Error(res.updateProfile.error ?? "Profile could not be updated");
  }
}

export async function changePasswordApi(input: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<void> {
  const res = await graphqlRequest<{ changePassword: { success: boolean; error: string | null } }>(
    `mutation ChangePassword($input: ChangePasswordInput!) {
       changePassword(input: $input) { success error }
     }`,
    { input }
  );
  if (!res.changePassword.success) {
    throw new Error(res.changePassword.error ?? "Password could not be changed");
  }
}