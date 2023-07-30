import express from "express";
import RoleController from "../controllers/RoleController";
import UserController from "../controllers/UserController"
import UserValidation from "../middleware/validation/UserValidation";
import Authorization from "../middleware/Authorization";

const router = express.Router()

router.get("/role", Authorization.Authenticated, RoleController.GetRole);
router.get("/role/:id", RoleController.GetRoleById);
router.post("/role", RoleController.CreateRole);
router.patch("/role/:id", RoleController.UpdateRole);
router.delete("/role/:id", RoleController.DeleteRole);

// User
router.post("/register", UserValidation.RegisterValidation, UserController.Register);
router.post("/login", UserController.Login);


export default router