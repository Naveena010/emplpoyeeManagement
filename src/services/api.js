import axios from 'axios';

const BASE = 'http://localhost:8086';

const api = axios.create({ baseURL: BASE });

// attach token to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// global response interceptor — extract error message from backend
api.interceptors.response.use(
  res => res,
  err => {
    const data    = err.response?.data;
    const status  = err.response?.status;

    // backend sends { status, error, message, timestamp }
    let message = 'Something went wrong. Please try again.';

    if (data) {
      if (typeof data === 'string')       message = data;
      else if (data.message)              message = data.message;
      else if (data.error)                message = data.error;
    }

    // map status codes to friendly messages if backend gave nothing useful
    if (!message || message === 'Something went wrong. Please try again.') {
      if (status === 400) message = 'Invalid request. Please check your input.';
      if (status === 401) message = 'Unauthorized. Please login again.';
      if (status === 403) message = 'You do not have permission to perform this action.';
      if (status === 404) message = 'Record not found.';
      if (status === 409) message = data?.message || 'Conflict — duplicate record.';
      if (status === 422) message = data?.message || 'Validation failed. Check the values entered.';
      if (status === 500) message = 'Server error. Please contact support.';
      if (!status)        message = 'Cannot connect to server. Make sure the backend is running.';
    }

    // attach clean message to the error so components can use it
    err.clientMessage = message;
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login    = (data) => api.post('/auth/login',    data);
export const register = (data) => api.post('/auth/register', data);

// ── Employees ─────────────────────────────────────────────────────────────────
export const getEmployees   = ()         => api.get('/employees');
export const getEmployee    = (id)       => api.get(`/employees/${id}`);
export const deleteEmployee = (id)       => api.delete(`/employees/${id}`);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);

export const createEmployee = (data) => {
  const xml = `<Employee>
  <name>${data.name}</name>
  <email>${data.email}</email>
  <department>${data.department}</department>
  <dateOfJoining>${data.dateOfJoining}</dateOfJoining>
  <phone>${data.phone || ''}</phone>
  <designation>${data.designation || ''}</designation>
  <salary>${data.salary || 0}</salary>
</Employee>`;
  return api.post('/employees', xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
};