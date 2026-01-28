// src/utils/auth.js

export const setCurrentUser = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (err) {
    console.error("Failed to save user to localStorage", err);
  }
};
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;
    return JSON.parse(user);
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
    localStorage.removeItem("user"); // clean corrupted data
    return null;
  }
};


export const removeCurrentUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("jwtToken");
};
