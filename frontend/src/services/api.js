const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const payload = contentType && contentType.includes('application/json')
    ? await response.json()
    : {};

  if (!response.ok) {
    const message = payload?.message || 'Request failed.';
    throw new Error(message);
  }

  return payload;
};

// Login endpoint that accepts username, password, and expected role
// Returns token and user info if role matches; otherwise throws error
export const login = async ({ username, password, expectedRole }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(response);
  
  // Validate that the user's actual role matches the expected role
  if (expectedRole && data.user && data.user.role !== expectedRole) {
    throw new Error(`User is not available in this login interface. Expected role: ${expectedRole}, but got: ${data.user.role}`);
  }

  return data;
};

// Get protected dashboard payload
export const getDashboard = async (token) => {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const changeUserRole = async ({ username, role }, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/change-role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, role }),
  });

  return handleResponse(response);
};

export const searchUsers = async (query, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ keyword: query }),
  });

  return handleResponse(response);
};
