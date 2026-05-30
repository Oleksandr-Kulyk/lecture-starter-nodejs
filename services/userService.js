import { userRepository } from "../repositories/userRepository.js";

class UserService {
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
    return userRepository.create(data);
  }

  update(id, dataToUpdate) {
    const item = this.getById(id);
    if (!item) {
      return null;
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
