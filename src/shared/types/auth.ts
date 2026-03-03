export interface User {
  id: string
  email: string
  created_at: string
}

export interface AuthSession {
  user: User
  access_token: string
}
