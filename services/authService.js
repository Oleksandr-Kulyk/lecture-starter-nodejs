import { userService } from "./userService.js";

class AuthService {
  login(userData) {
    const { email, password } = userData;
    const user = userService.getByEmail(email);

    if (!user || user.password !== password) {
      throw new Error("Invalid email or password");
    }

    return user;
  }
}

const authService = new AuthService();

export { authService };
