import axios, { AxiosInstance } from "axios";

export class AuthService {
  protected readonly instance: AxiosInstance;

  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }
  login = async (email: string, password: string) =>
    this.instance
      .post(
        "/api/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .then((res) => ({
        email: res.data.email,
      }))
      .catch((err) => console.log(err));

  register = async (email: string, password: string) =>
    this.instance
      .post("/api/register", {
        email,
        password,
      })
      .then((res) => ({
        email: res.data.email,
        expiresAt: res.data.expiresAt,
      }))
      .catch((err) => console.log(err));

  logout = async () => {
    this.instance
      .post("/api/logout", {}, { withCredentials: true })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  currentUser = async () =>
    this.instance
      .get("/api/protected", { withCredentials: true })
      .then((res) => ({
        user: res.data.user,
      }))
      .catch((err) => console.log(err));
}

export const authService = new AuthService("http://localhost:5000");
