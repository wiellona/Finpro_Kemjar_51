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

export const login = async ({ username, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  return handleResponse(response);
};

export const fetchUsers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const changeUserRole = async ({ userId, role }, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  return handleResponse(response);
};

export const searchUsers = async (query, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/search?query=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};
