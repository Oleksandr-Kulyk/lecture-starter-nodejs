import { fightRepository } from "../repositories/fightRepository.js";

class FightService {
  getAll() {
    return fightRepository.getAll();
  }

  getById(id) {
    const item = fightRepository.getOne({ id });
    if (!item) {
      return null;
    }
    return item;
  }

  create(data) {
    return fightRepository.create(data);
  }

  update(id, dataToUpdate) {
    const item = this.getById(id);
    if (!item) {
      return null;
    }
    return fightRepository.update(id, dataToUpdate);
  }

  delete(id) {
    const item = this.getById(id);
    if (!item) {
      return null;
    }
    return fightRepository.delete(id);
  }
}

const fightService = new FightService();

export { fightService };
