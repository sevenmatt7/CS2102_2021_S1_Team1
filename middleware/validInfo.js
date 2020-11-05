  module.exports = function(req, res, next) {
    const { email, name, password, address } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      console.log(!email.length);
      if (![name, email, password, address].every(Boolean)) {
        return res.status(401).json("Please fill in all the fields");
      } else if (!validEmail(email)) {
        return res.status(401).json("Invalid Email");
      }

    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.status(401).json("Invalid Email");
      }
    } 
    // else if (req.path === "/registerpet") {
    //   if (![pet_name, special_req, pet_type, gender].every(Boolean)) {
    //     return res.status(401).json("Missing Info");
    //   } 
    // }
  
    next();
  };