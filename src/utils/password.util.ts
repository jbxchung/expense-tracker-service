export function validatePassword(password: string | undefined): boolean {
  if (!password) return false;

  const minLength = 8;
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  return (
    password.length >= minLength &&
    hasUpperAndLower &&
    hasNumber
  );
}
