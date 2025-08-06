export function logout(): void {
  localStorage.removeItem("currentUser")
}

export function getCurrentUser(): string | null {
  return localStorage.getItem("currentUser")
}
