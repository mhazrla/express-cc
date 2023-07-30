import { Request, Response, NextFunction } from 'express';
import Helper from '../../helpers/Helper';
import Validator from 'validatorjs';
import User from '../../db/models/User';

const RegisterValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, confirmPassword } = req.body

        const data = {
            name, email, password, confirmPassword
        }

        const rule: Validator.Rules = {
            "name": "required|string|max:50",
            "email": "required|string",
            "password": "required|min:8",
            "confirmPassword": "required|same:password",
        }

        const validate = new Validator(data, rule)

        if (validate.fails()) {
            console.log(validate.errors)
            return res.status(400).send(Helper.ResponseData(400, "Bad Request", validate.errors, null))
        }

        const user = await User.findOne({
            where: {
                email: data.email
            }
        })

        if (user) {

            return res.status(400).send(Helper.ResponseData(400, "Bad Request", "Email already exist", null))
        }

        next()
    } catch (error: any) {
        return res.status(500).send(Helper.ResponseData(500, "", error, null))
    }
}



export default { RegisterValidation, }