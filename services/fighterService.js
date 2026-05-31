import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  isSameValue(firstValue, secondValue) {
    return firstValue.toLowerCase() === secondValue.toLowerCase();
  }

  getByName(name) {
    return this.getAll().find((fighter) => this.isSameValue(fighter.name, name));
  }

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
    if (this.getByName(data.name)) {
      throw new Error("Fighter with this name already exists");
    }

    return fighterRepository.create(data);
  }

  update(id, dataToUpdate) {
    const item = this.getById(id);
    if (!item) {
      return null;
    }

    if (dataToUpdate.name) {
      const fighterWithSameName = this.getByName(dataToUpdate.name);

      if (fighterWithSameName && fighterWithSameName.id !== id) {
        throw new Error("Fighter with this name already exists");
      }
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
