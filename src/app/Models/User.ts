export interface RegisterUser{
  firstName: string | null,
  lastName: string | null,
  email: string | null,
  password: string | null,
  role: string | null,
  city: string | null,
  skills: string | null,
  experience: number,
  phoneNumber: string | null,
  profileImageUrl: string | null
}

export interface LoginDetails{
  email: string | null,
  password: string | null
}

export interface UserDetails{
  id: string | null,
  userName: string | null,
  email: string | null,
  dateCreated: string | null,
  role: string | null,
  experience: number,
  tier: string | null,
  city: string | null,
  score: number,
  profileImageUrl: string | null,
  skills: string | null,
  phoneNumber: string | null
}
