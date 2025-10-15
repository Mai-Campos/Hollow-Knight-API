export const login = async (form) => {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error al iniciar sesión");
  }

  localStorage.setItem("accessToken", data.accessToken);
  return data;
};

export const refreshToken = async () => {
  const res = await fetch("http://localhost:3000/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Error al refrescar el token");

  localStorage.setItem("accessToken", data.accessToken);

  return data.accessToken;
};

export const logout = async () => {
  await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  localStorage.removeItem("accessToken");
};
