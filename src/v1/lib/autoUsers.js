const User = require("../models/user");
const Bcryptjs = require("bcryptjs");
const Role = require('../models/roles');

exports.autoCreateUser = async () => {
  try {
    const adminRole = await Role.findOne({roleName:'Admin'});
    const collection = await User.count();
    if(collection === 0)
    {
      const name = "Bijoy";
      const userName = "Bijoy007";
      const password = "abcd@1234";
      const email = "rohitnaru101@gmail.com";
      const roleName = "Admin";
      const role = adminRole._id;
      const hashPassword = await Bcryptjs.hash(password, 12);
      const body = {
        name,
        userName,
        password: hashPassword,
        email,
        roleName,
        role,
      };
      const user = await User.create(body);
      if(user){
        console.log('Admin user inserted')
      }
    }
    else {
      console.log("Admin user present");
    }
  } catch (error) {
    console.log(error);
  }
};
