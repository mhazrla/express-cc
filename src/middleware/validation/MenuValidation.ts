import { Request, Response, NextFunction } from 'express';
import Helper from '../../helpers/Helper';
import Validator from 'validatorjs';
import SubMenu from '../../db/models/SubMenu';
import MasterMenu from '../../db/models/MasterMenu';
import RoleMenuAccess from '../../db/models/RoleMenuAccess';
import Role from '../../db/models/Role';

const CreateMenuValidaiton = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, icon, ordering } = req.body
        const data = {
            name, icon, ordering
        }

        const rules: Validator.Rules = {
            "name": "required|string|max:50",
            "icon": "required|string",
            "ordering": "required|integer",
        }

        const validate = new Validator(data, rules);

        if (validate.fails()) {
            console.log(validate.errors)
            return res.status(400).send(Helper.ResponseData(400, "Bad Request", validate.errors, null))
        }

        next()
    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null))
    }
}

const CreateSubMenuValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, masterMenuId, url, title, icon, ordering, isTargetSelf } = req.body
        const data = {
            name, masterMenuId, url, title, icon, ordering, isTargetSelf
        }

        const rules: Validator.Rules = {
            "name": "required|string|max:50",
            "masterMenuId": "required|integer",
            "url": "required|string",
            "title": "required|string",
            "icon": "required|string|max:50",
            "isTargetSelf": "required|boolean",
            "ordering": "required|integer",
        }

        const validate = new Validator(data, rules);

        if (validate.fails()) {
            return res.status(400).send(Helper.ResponseData(400, "Bad Request", validate.errors, null))
        }

        const menu = await MasterMenu.findOne({
            where: {
                id: masterMenuId,
                active: true,

            }
        })

        if (!menu) {
            const errorData = {
                errors: {
                    masterMenuId: [
                        "Master Menu Not Found"
                    ]
                }
            }
            return res.status(400).send(Helper.ResponseData(400, "Bad Request", errorData, null))
        }

        next()
    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null))
    }
}

const CreateRoleMenuAccessValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roleId, submenuId } = req.body
        const data = {
            roleId, submenuId
        }

        const rules: Validator.Rules = {
            "roleId": "required|integer",
            "submenuId": "required|integer",
        }

        const validate = new Validator(data, rules);

        if (validate.fails()) {
            return res.status(400).send(Helper.ResponseData(400, "Bad Request", validate.errors, null))
        }

        const role = await Role.findOne({
            where: {
                id: roleId,
                active: true
            }
        })

        if (!role) {
            const errorData = {
                errors: {
                    roleId: [
                        "Role Not Found"
                    ]
                }
            }
            return res.status(400).send(Helper.ResponseData(400, "Bad Request", errorData, null))
        }

        const subMenu = SubMenu.findOne({ where: { id: submenuId, active: true } })
        if (!subMenu) {
            const errorData = {
                errors: {
                    submenuId: [
                        "Submenu Not Found"
                    ]
                }
            }
            return res.status(400).send(Helper.ResponseData(400, "Bad Request", errorData, null))
        }
        next()
    } catch (error) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null))
    }
}

export default { CreateMenuValidaiton, CreateSubMenuValidation, CreateRoleMenuAccessValidation }