const Dropdown = require("../models/dropdown");
const RoleModels = require("../models/roles");
const roles = require("./roles.json");
const {autoCreateUser} =require('./autoUsers')

exports.autoCreateRoles = async () => {
  try {
    const collection = await RoleModels.count();
    if (collection === 0) {
      await RoleModels.insertMany(roles);
      console.log("Roles inserted");
      const user = await autoCreateUser()
      if(user){
        console.log("Admin user is inserted");
      }
    } else {
      console.log("Roles are present");
      console.log("Admin user is present");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.autoCreateDropDown = async () => {
  try {
    const count = await Dropdown.count();
    if (count === 0) {
      const newOptions = new Dropdown({
        tag: [],
        inActiveReason: [],
        category: [],
      });
      await newOptions.save();
      console.log("Dropdown inserted");
    } else {
      console.log("Dropdown is present");
    }
  } catch (error) {
    console.log(error);
  }
};
