module.exports = class UserInfoDto {
    id;
    isActivated;
    age;
    first_name;
    last_name;
    photo_50;
    gender;
    status;
    description;
    constructor(model) {
        this.id = model.user;
        this.isActivated = model.isActivated;
        this.age = model.age;
        this.first_name = model.first_name;
        this.last_name = model.last_name;
        this.photo_50 = model.photo_50;
        this.gender = model.gender;
        this.status = model.status;
        this.description = model.description;
    }
}