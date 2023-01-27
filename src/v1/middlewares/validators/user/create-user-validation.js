const Role = require('../../../models/roles');

module.exports = async (req,res,next)=>{
    try{
    const roleId = req.roleId;
    const role = await Role.findById(roleId);
    if(role){
        req.method = "create";
        req.roleName = role.roleName
        req.fieldRestriction = role.fieldRestriction;
        req.collectionName = "user"
        next();
    }else{
        return res.status(500).json({
            status:false,
            message:"Invalid Token",
            data:"",
        })
    }
    }catch{
        if (!error.statusCode) {
            error.statusCode = 500;
          }
        next(error);
    }
}