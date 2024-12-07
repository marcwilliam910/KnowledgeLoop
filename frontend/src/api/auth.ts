import axios from "axios";

type Auth = {
  username: string;
  password: string;
};

export async function handleLogin({username, password}: Auth) {
  const {data} = await axios.post("http://127.0.0.1:8000/api/login/", {
    username,
    password,
  });
  return data;
}

export async function handleRegister({username, password}: Auth) {
  const {data} = await axios.post("http://127.0.0.1:8000/api/register/", {
    username,
    password,
  });
  return data;
}

export async function handleAdminLogin({username, password}: Auth) {
  const {data} = await axios.post("http://127.0.0.1:8000/api/admin-login/", {
    username,
    password,
  });
  return data;
}
