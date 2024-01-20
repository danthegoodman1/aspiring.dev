export function isAdminEmail(email: string) {
  return (process.env.ADMIN_EMAILS ?? "").split(",").includes(email)
}

export function getSQLiteDate(dateString: string): Date {
  // 2024-01-20 22:41:22 format
  return new Date(dateString.replace(" ", "T") + "Z")
}
