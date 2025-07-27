export const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdmin = token === "xyz";
  console.log("check admin");
  if (!isAdmin) {
    res.status(401).send("not a admin");
  } else {
    next();
  }
};

export const userAuth = (req, res, next) => {
  const token = "xyzx";
  const isUser = token === "xyz";
  console.log("check user");
  if (!isUser) {
    res.status(401).send("not a user");
  } else {
    next();
  }
};
