// Save user data after login
export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

// Get user safely
export function getUser() {
  const data = localStorage.getItem("user");
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Invalid user data in localStorage");
    localStorage.removeItem("user");
    return null;
  }
}

// Get only the role
export function getUserRole() {
  const user = getUser();
  return user?.role || null;
}

// Logout function
export function logout() {
  localStorage.removeItem("user");
}
