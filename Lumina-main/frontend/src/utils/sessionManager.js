/**
 * SESSION MANAGER UTILS
 * Manages child PIN session and admin session in localStorage.
 */

// ─── Child Session ──────────────────────────────────────────────────────────

/**
 * Saves the child session data to localStorage.
 * @param {string} studentId
 * @param {string} pin
 */
export const saveChildSession = (studentId, pin) => {
  localStorage.setItem('childSession', JSON.stringify({
    studentId,
    pin,
    loginTime: Date.now()
  }));
};

/**
 * Retrieves the child session from localStorage.
 * @returns {{ studentId: string, pin: string, loginTime: number } | null}
 */
export const getChildSession = () => {
  const data = localStorage.getItem('childSession');
  return data ? JSON.parse(data) : null;
};

/**
 * Checks if a valid child session exists (less than 24 hours old).
 * @returns {boolean}
 */
export const isChildSessionValid = () => {
  const session = getChildSession();
  if (!session) return false;
  const hours24 = 24 * 60 * 60 * 1000;
  return (Date.now() - session.loginTime) < hours24;
};

/**
 * Clears the child session from localStorage.
 */
export const clearChildSession = () => {
  localStorage.removeItem('childSession');
};


// ─── Admin Session ──────────────────────────────────────────────────────────

/**
 * Saves the admin session data to localStorage.
 * @param {string} userId
 * @param {string} role
 */
export const saveAdminSession = (userId, role) => {
  localStorage.setItem('adminSession', JSON.stringify({
    userId,
    role
  }));
};

/**
 * Retrieves the admin session from localStorage.
 * @returns {{ userId: string, role: string } | null}
 */
export const getAdminSession = () => {
  const data = localStorage.getItem('adminSession');
  return data ? JSON.parse(data) : null;
};

/**
 * Clears the admin session from localStorage.
 */
export const clearAdminSession = () => {
  localStorage.removeItem('adminSession');
};
