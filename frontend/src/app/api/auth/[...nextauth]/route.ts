// NextAuth.js API Route Handler
// This file should be moved to: frontend/src/app/api/auth/[...nextauth]/route.ts
// Due to filesystem limitations, manually create the folder [...]nextauth] and move this file

import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
