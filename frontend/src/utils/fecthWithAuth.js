export const fetchWithAuth = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshRes = await fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("accessToken", data.accessToken);

      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${data.accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } else {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
    }
  }

  return res;
};
