
// const JWT = require("jsonwebtoken");

// module.exports = async (req, res, next) => {
//   try {
//     const token = req.headers["authorization"].split(" ")[1];
//     JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
//       if (err) {
//         return res.status(401).send({
//           success: false,
//           message: "Auth Failed",
//         });
//       } else {
//         req.body.userId = decode.userId;
//         next();
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(401).send({
//       success: false,
//       error,
//       message: "Auth Failed",
//     });
//   }
// };

const JWT = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }
    const token = authHeader.split(" ")[1];

    const decode = JWT.verify(token, process.env.JWT_SECRET);

    req.userId = decode.userId;

    next();

  } catch (error) {
    console.log("Auth Middleware Error:", error.message);

    return res.status(401).send({
      success: false,
      message: "Auth Failed",
      error: error.message,
    });
  }
};