export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export function sanitizeUser<T extends { email: string; password?: string }>(user: T) {
  const { password: _pw, ...safe } = user;
  return { ...safe, isAdmin: isAdminEmail(user.email) };
}
