/**
 * Client Session Storage Helpers
 * (Backend server at http://localhost:5000/api handles all database operations)
 */

export function isAdminLoggedIn() {
  return sessionStorage.getItem('durgesh_admin_session') === 'true';
}

export function setAdminLoggedIn(isLoggedIn) {
  if (isLoggedIn) {
    sessionStorage.setItem('durgesh_admin_session', 'true');
  } else {
    sessionStorage.removeItem('durgesh_admin_session');
  }
}
