import { userRepository } from "../repositories/userRepository.js";

class UserService {
  isSameValue(firstValue, secondValue) {
    return firstValue.toLowerCase() === secondValue.toLowerCase();
  }

  getByEmail(email) {
    return this.getAll().find((user) => this.isSameValue(user.email, email));
  }

  getByPhone(phone) {
    return this.getAll().find((user) => this.isSameValue(user.phone, phone));
  }

  getAll() {
    return userRepository.getAll();
  }

  getById(id) {
    const item = userRepository.getOne({ id });
    if (!item) {
      return null;
    }
    return item;
  }

  create(data) {
    if (this.getByEmail(data.email)) {
      throw new Error("User with this email already exists");
    }

    if (this.getByPhone(data.phone)) {
      throw new Error("User with this phone already exists");
    }

    return userRepository.create(data);
  }

  update(id, dataToUpdate) {
    const item = this.getById(id);
    if (!item) {
      return null;
    }

    if (dataToUpdate.email) {
      const userWithSameEmail = this.getByEmail(dataToUpdate.email);

      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new Error("User with this email already exists");
      }
    }

    if (dataToUpdate.phone) {
      const userWithSamePhone = this.getByPhone(dataToUpdate.phone);

      if (userWithSamePhone && userWithSamePhone.id !== id) {
        throw new Error("User with this phone already exists");
      }
    }

    return userRepository.update(id, dataToUpdate);
  }

  delete(id) {
    const item = this.getById(id);
    if (!item) {
      return null;
    }
    return userRepository.delete(id);
  }

  search(search) {
    const item = userRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }
}

const userService = new UserService();

export { userService };
