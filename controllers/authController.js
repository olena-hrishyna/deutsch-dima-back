const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");

const generateToken = (id, isAdmin, isSuperAdmin) => {
  const payload = {
    id,
    isAdmin,
    isSuperAdmin,
  };

  return jwt.sign(payload, secret, { expiresIn: `744h` });
};

class authController {
  async registr(req, res) {
    try {
      const { password, login } = req.body;
      const candidate = await User.findOne({ login });
      if (candidate) {
        return res.status(400).json({
          message: "Користувач із таким логіном вже існує",
        });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = await new User({
        login,
        password: hashPassword,
      }).save();

      const token = generateToken(user._id, user.isAdmin, user.isSuperAdmin);
      return res.json({
        message: "Користувач успішно зареєстрований",
        token,
        user,
      });
    } catch (err) {
      res.status(400).json({
        message: "Помилка реєстрації",
        err,
      });
    }
  }

  async login(req, res) {
    try {
      const { login, password } = req.body;
      const user = await User.findOneAndUpdate(
        { login },
        { $set: { lastVisit: new Date() } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: `Користувача ${login} не знайдено`,
        });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          message: "Введено неправильний пароль",
        });
      }
      const token = generateToken(user._id, user.isAdmin, user.isSuperAdmin);

      return res.json({ token, user });
    } catch (err) {
      res.status(401).json({
        message: "Помилка вхіда",
        err,
      });
    }
  }

  async getMyAccount(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findById({ _id: userId });
      const token = generateToken(userId, user.isAdmin, user.isSuperAdmin);

      return res.status(200).json({ user, token });
    } catch (err) {
      res.status(401).json({
        message: "Помилка входу",
        err,
      });
    }
  }

  async visit(req, res) {
    try {
      await User.findOneAndUpdate(
        { _id: req.userId },
        { $set: { lastVisit: new Date() } },
      );

      return res.status(200).json(true);
    } catch (err) {
      res.status(401).json({
        message: "Помилка оновлення дати входу",
        err,
      });
    }
  }

  async updateMyAccount(req, res) {
    try {
      const userId = req.userId;
      const { password, login } = req.body;
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            login,
            updatedAt: new Date(),
            lastVisit: new Date(),
            ...(password && { password: bcrypt.hashSync(password, 7) }),
          },
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Обліковий запис оновлено",
        user,
      });
    } catch (err) {
      res.status(401).json({
        message: "Помилка оновлення облікового запису",
        err,
      });
    }
  }

  async deleteMyAccount(req, res) {
    try {
      const userId = req.userId;
      await User.findOneAndDelete({ _id: userId });

      return res.status(200).json({
        message: "Обліковий запис видалено",
        userId,
      });
    } catch (err) {
      res.status(401).json({
        message: "Помилка видалення облікового запису",
        err,
      });
    }
  }
}

module.exports = new authController();
