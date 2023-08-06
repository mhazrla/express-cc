import { Request, Response } from "express";
import User from "../db/models/User";
import Helper from "../helpers/Helper";
import PasswordHelper from "../helpers/PasswordHelper";
import Role from "../db/models/Role";
import RoleMenuAccess from "../db/models/RoleMenuAccess";
import MasterMenu from "../db/models/MasterMenu";
import SubMenu from "../db/models/SubMenu";
import { Op } from "sequelize";

const Register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password, confirmPassword, roleId } = req.body;

        const hashed = await PasswordHelper.PasswordHashing(password);
        const user = await User.create({
            name,
            email,
            password: hashed,
            verified: true,
            active: true,
            roleId,
        });

        return res.status(201).send(Helper.ResponseData(201, "Created", "", user));
    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
};

const Login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (!user)
            return res
                .status(401)
                .send(Helper.ResponseData(401, "Unauthotized", null, null));

        const matched = await PasswordHelper.ComparePassword(
            password,
            user.password
        );
        if (!matched)
            return res
                .status(401)
                .send(Helper.ResponseData(401, "Unauthotized", null, null));

        const dataUser = {
            name: user.name,
            email: user.email,
            roleId: user.roleId,
            verified: user.verified,
            active: user.active,
        };

        const token = Helper.GenerateToken(dataUser);
        const refreshToken = Helper.GenerateRefreshToken(dataUser);

        user.accessToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        const roleAccess = await RoleMenuAccess.findAll({
            where: {
                roleId: user.roleId,
                active: true
            }
        })


        const listSubMenuId = roleAccess.map((item) => {
            return item.submenuId
        })

        const menuAccess = await MasterMenu.findAll({
            where: {
                active: true
            },
            order: [["ordering", "ASC"], [SubMenu, "ordering", "ASC"]],
            include: {
                model: SubMenu,
                where: {
                    id: { [Op.in]: listSubMenuId }
                },
            }
        })


        const responseUser = {
            name: user.name,
            email: user.email,
            roleId: user.roleId,
            verified: user.verified,
            active: user.active,
            token: token,
            menuAccess
        };
        return res
            .status(200)
            .send(Helper.ResponseData(200, "OK", null, responseUser));
    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
};

const RefreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res
                .status(401)
                .send(Helper.ResponseData(401, "", "Unauthorized", null));
        }

        const decodedUser = Helper.ExtractRefreshToken(refreshToken);
        if (!decodedUser) {
            return res
                .status(401)
                .send(Helper.ResponseData(401, "", "Unauthorized", null));
        }

        const token = Helper.GenerateToken({
            name: decodedUser.name,
            email: decodedUser.email,
            roleId: decodedUser.roleId,
            verified: decodedUser.verified,
            active: decodedUser.active,
        });

        const resultUser = {
            name: decodedUser.name,
            email: decodedUser.email,
            roleId: decodedUser.roleId,
            verified: decodedUser.verified,
            active: decodedUser.active,
            token: token,
        };

        return res
            .status(200)
            .send(Helper.ResponseData(200, "OK", null, resultUser));
    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
};

const UserDetail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const email = res.locals.userEmail;

        const user = await User.findOne({
            where: {
                email,
            },
            include: {
                model: Role,
                attributes: ["id", "roleName"],
            },
        });

        if (!user) {
            return res
                .status(404)
                .send(Helper.ResponseData(404, "User Not Found", null, null));
        }

        user.password = "";
        user.accessToken = "";
        return res.status(200).send(Helper.ResponseData(200, "OK", null, user));
    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
};

const Logout = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res
                .status(200)
                .send(Helper.ResponseData(200, "User logged out", null, null));
        }

        const email = res.locals.userEmail;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.clearCookie(refreshToken);
            return res
                .status(200)
                .send(Helper.ResponseData(200, "User logged out", null, null));
        }
        await user.update({ accessToken: null }, { where: { email } });
        res.clearCookie(refreshToken);
        return res
            .status(200)
            .send(Helper.ResponseData(200, "User logged out", null, null));
    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null));
    }
};

export default { Register, Login, RefreshToken, UserDetail, Logout };
