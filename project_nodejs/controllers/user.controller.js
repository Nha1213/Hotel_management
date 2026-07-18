const { User, UserProfile, Role, Permission } = require("../models");
const { logError } = require("../middlewares/logError");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../util/TOKEN_SECRET");
const user = require("../models/user");
const buildPhotoPath = (file) => {
  if (!file) return null;
  return `/image/${file.filename}`;
};

// ====================== GET USERS ======================
const getAllUsers = async (req, res) => {
  try {
    const { id, search } = req.query;

    const where = {};

    if (id) {
      where.id = id;
    }

    if (search) {
      where.username = {
        [Op.like]: `%${search}%`,
      };
    }

    const users = await User.findAll({
      where,
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "role_name", "status"],
          through: {
            attributes: [],
          },
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["id", "permission_name", "group_id", "route_name"],
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    // const userProfile =  [{...users}]

    for (const user of users) {
      const userProfile = await UserProfile.findOne({
        where: { user_id: user.id },
      });
      if (userProfile) {
        user.dataValues.user_profile = userProfile;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Fetch User Successful",
      data: users,
    });
  } catch (error) {
    logError("getAllUsers", error, res);
  }
};
// ====================== REGISTER ======================
const registerUser = async (req, res) => {
  const t = await User.sequelize.transaction();

  try {
    const {
      username,
      password,
      first_name,
      last_name,
      gender,
      phone,
      address,
    } = req.body;

    const file = req.files?.[0];
    const image = buildPhotoPath(file);

    const existingUser = await User.findOne({
      where: { username },
      transaction: t,
    });

    if (existingUser) {
      await t.rollback();

      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      {
        username,
        password: hashedPassword,
      },
      { transaction: t },
    );

    const profile = await UserProfile.create(
      {
        user_id: user.id,
        first_name,
        last_name,
        gender,
        phone,
        address,
        image,
      },
      { transaction: t },
    );

    await t.commit();

    const result = user.toJSON();
    delete result.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: result,
        profile,
      },
    });
  } catch (error) {
    await t.rollback();
    logError("registerUser", error, res);
  }
};

// ====================== UPDATE ======================
const updateUser = async (req, res) => {
  const t = await User.sequelize.transaction();

  try {
    const { id } = req.params;

    const {
      username,
      password,
      first_name,
      last_name,
      gender,
      phone,
      address,
    } = req.body;

    const file = req.files?.[0];

    const user = await User.findByPk(id, {
      transaction: t,
    });

    if (!user) {
      await t.rollback();

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateUserData = {};

    if (username) {
      updateUserData.username = username;
    }

    if (password) {
      updateUserData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateUserData, {
      transaction: t,
    });

    const profile = await UserProfile.findOne({
      where: {
        user_id: id,
      },
      transaction: t,
    });

    const updateProfileData = {
      first_name,
      last_name,
      gender,
      phone,
      address,
    };

    if (file) {
      updateProfileData.image = buildPhotoPath(file);
    }

    await profile.update(updateProfileData, {
      transaction: t,
    });

    await t.commit();

    return res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    await t.rollback();
    logError("updateUser", error, res);
  }
};

// ====================== DELETE ======================
const deleteUser = async (req, res) => {
  const t = await User.sequelize.transaction();

  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      transaction: t,
    });

    if (!user) {
      await t.rollback();

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await UserProfile.destroy({
      where: {
        user_id: id,
      },
      transaction: t,
    });

    await User.destroy({
      where: {
        id,
      },
      transaction: t,
    });

    await t.commit();

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    await t.rollback();
    logError("deleteUser", error, res);
  }
};

const LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: UserProfile,
          as: "userp_rofile", // must match your association
        },
        {
          model: Role,
          as: "roles",
          attributes: ["id", "role_name", "status"],
          through: {
            attributes: [],
          },
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["id", "permission_name", "group_id", "route_name"],
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Flatten permissions
    const permissions = [];

    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissions.push(permission);
      });
    });

    const uniquePermissions = [
      ...new Map(permissions.map((p) => [p.id, p])).values(),
    ];

    const ObjUser = {
      id: user.id,
      username: user.username,
      status: user.status,
      profile: user.userp_rofile,
      roles: user.roles,
      permissions: uniquePermissions,
    };

    return res.json({
      success: true,
      message: "Login successful",
      data: ObjUser,
      token: await getAccessToken(ObjUser),
    });
  } catch (error) {
    logError("LoginUser", error, res);
  }
};

const getAccessToken = async (paramData) => {
  const access_token = await jwt.sign({ data: paramData }, TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return access_token;
};
const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token Required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 1. Generate a new Access Token
    const newAccessToken = await getAccessToken(decoded.data);

    // 2. ROTATION: Generate a brand new Refresh Token
    const newRefreshToken = await getRefreshToken(decoded.data);

    // 3. OPTIONAL: If using database tracking, update it here:
    // await TokenModel.replaceOldWithNew(refreshToken, newRefreshToken);

    // 4. Send the new Refresh Token back in a secure cookie
    // (or include it in the JSON body if you aren't using cookies)
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true, // Requires HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching JWT expiration
    });

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res  
      .status(403)
      .json({ message: "Invalid or Expired Refresh Token" });
  }
};

// Export the functions correctly
module.exports = {
  getAllUsers,
  registerUser,
  updateUser,
  deleteUser,
  LoginUser,
  handleRefreshToken, // Exporting the function handler
};
