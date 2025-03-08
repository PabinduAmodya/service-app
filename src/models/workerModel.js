import User from './userModel.js';

class Worker extends User {
  constructor(name, email, password, workType, location, yearsOfExperience) {
    super(name, email, password, 'worker'); // Worker role by default
    this.workType = workType;
    this.location = location;
    this.yearsOfExperience = yearsOfExperience;
  }
}

export default Worker;
