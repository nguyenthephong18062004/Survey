const API_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const authAPI = {
  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
  register: async (userData: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },
  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  }
};

export const subjectAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/subjects`, { headers: getHeaders() });
    return res.json();
  },
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/subjects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};

export const surveyAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/surveys`, { headers: getHeaders() });
    return res.json();
  },
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/surveys`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_URL}/surveys/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_URL}/surveys/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },
  submit: async (assignmentId: number, responses: any[]) => {
    const res = await fetch(`${API_URL}/surveys/${assignmentId}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ responses })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Submission failed');
    }
    return res.json();
  }
};

export const semesterAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/semesters`, { headers: getHeaders() });
    return res.json();
  },
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/semesters`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_URL}/semesters/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_URL}/semesters/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};

export const assignmentAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/assignments`, { headers: getHeaders() });
    return res.json();
  },
  getStudentAssignments: async () => {
    const res = await fetch(`${API_URL}/assignments/student/me`, { headers: getHeaders() });
    return res.json();
  },
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/assignments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_URL}/assignments/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_URL}/assignments/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};

export const userAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
    return res.json();
  },
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};

export const reportAPI = {
  getSubjectReport: async (subjectId: number) => {
    const res = await fetch(`${API_URL}/reports/subject/${subjectId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
  },
  getSchoolReport: async () => {
    const res = await fetch(`${API_URL}/reports/school`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch school report');
    return res.json();
  }
};
