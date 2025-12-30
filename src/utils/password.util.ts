export function validatePassword(password: string | undefined): boolean {
  if (!password) return false;

  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  return (
    password.length >= minLength &&
    hasLetter &&
    hasNumber
  );
}
