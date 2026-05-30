import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  getAll() {
    return fighterRepository.getAll();
  }

  getById(id) {
    const item = fighterRepository.getOne({ id });
    if (!item) {
      return null;
    }
    return item;
  }

  create(data) {
    return fighterRepository.create(data);
  }

  update(id, dataToUpdate) {
    const item = this.getById(id);
    if (!item) {
      return null;
    }
    return fighterRepository.update(id, dataToUpdate);
  }

  delete(id) {
    const item = this.getById(id);
    if (!item) {
      return null;
    }
    return fighterRepository.delete(id);
  }
}

const fighterService = new FighterService();

export { fighterService };
