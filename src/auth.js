/* ================= SAVE USER ================= */
// Save user data safely (id, name, email, role, etc.)
export function saveUser(user) {
  if (!user || typeof user !== "object") {
    console.error("Invalid user data provided");
    return;
  }

  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save user:", error);
  }
}

/* ================= GET USER ================= */
// Get stored user data safely
export function getUser() {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Corrupted user data in localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
}

/* ================= USER ROLE ================= */
// Get only the role of the logged-in user
export function getUserRole() {
  const user = getUser();
  return user?.role || null;
}

/* ================= LOGIN STATUS ================= */
// Check if user is logged in
export function isLoggedIn() {
  return !!getUser();
}

/* ================= LOGOUT ================= */
// Clear all session data (VERY IMPORTANT)
export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
