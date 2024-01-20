export function isAdminEmail(email: string) {
  return (process.env.ADMIN_EMAILS ?? "").split(",").includes(email)
}
