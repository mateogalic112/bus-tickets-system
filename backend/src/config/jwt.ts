export default {
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string, 10),
  secret: process.env.JWT_SECRET as string,
};
