import { UserRole } from "@prisma/client"

export function isModerator(userId: string, listModerators: {userId: string}[]) {
  const value = listModerators.find(mod => mod.userId === userId)

  return Boolean(value)
}

export function isAdmin(role: UserRole) {
  return role === UserRole.ADMIN
}

export function isCreator(userId: string, creatorId: string) {
  return userId === creatorId
}