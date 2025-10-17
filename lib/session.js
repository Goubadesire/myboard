export function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user))
}

export function getUser() {
  if (typeof window === "undefined") return null
  return JSON.parse(localStorage.getItem("user"))
}

export function clearUser() {
  localStorage.removeItem("user")
}
