import express from "express";
import RoleController from "../controllers/RoleController";
import UserController from "../controllers/UserController";
import UserValidation from "../middleware/validation/UserValidation";
import MenuValidation from "../middleware/validation/MenuValidation";
import Authorization from "../middleware/Authorization";
import MasterMenuController from "../controllers/MasterMenuController";
import SubMenuController from "../controllers/SubMenuController";
import RoleMenuAccessController from "../controllers/RoleMenuAccessController";

const router = express.Router();

// Role
router.get(
    "/role",
    Authorization.Authenticated,
    RoleController.GetRole
);
router.get(
    "/role/:id",
    Authorization.Authenticated,
    RoleController.GetRoleById
);
router.post(
    "/role",
    Authorization.Authenticated,
    Authorization.AdminRole,
    RoleController.CreateRole
);
router.patch(
    "/role/:id",
    Authorization.Authenticated,
    Authorization.AdminRole,
    RoleController.UpdateRole
);
router.delete(
    "/role/:id",
    Authorization.Authenticated,
    Authorization.SuperUser,
    RoleController.DeleteRole
);

// User
router.post(
    "/register",
    UserValidation.RegisterValidation,
    UserController.Register
);
router.post("/login", UserController.Login);
router.get("/user/refresh-token", UserController.RefreshToken);
router.get(
    "/user/current-user",
    Authorization.Authenticated,
    UserController.UserDetail
);
router.get("/logout", Authorization.Authenticated, UserController.Logout);

// Master Menu
router.post("/menu", MenuValidation.CreateMenuValidaiton, Authorization.Authenticated, Authorization.AdminRole, MasterMenuController.CreateMenu)
router.get("/menu/:id", Authorization.Authenticated, Authorization.AdminRole, MasterMenuController.GetDetailMenu)
router.get("/menu", Authorization.Authenticated, Authorization.AdminRole, MasterMenuController.GetListMenu)
router.get("/menu/get/all", Authorization.Authenticated, Authorization.SuperUser, MasterMenuController.GetAllMenu)
router.patch("/menu/:id", MenuValidation.CreateMenuValidaiton, Authorization.Authenticated, Authorization.AdminRole, MasterMenuController.UpdateMenu)
router.delete("/menu/:id", Authorization.Authenticated, Authorization.AdminRole, MasterMenuController.SoftDeleteMenu)
router.delete("/menu/permanent/:id", Authorization.Authenticated, Authorization.SuperUser, MasterMenuController.PermanentDeleteMenu)


// SubMenu
router.post("/sub-menu", MenuValidation.CreateMenuValidaiton, Authorization.Authenticated, Authorization.AdminRole, SubMenuController.CreateSubMenu);
router.get("/sub-menu", Authorization.Authenticated, Authorization.AdminRole, SubMenuController.GetListSubMenu);
router.get("/sub-menu/get/all", Authorization.Authenticated, Authorization.SuperUser, SubMenuController.GetAllSubMenu);
router.get("/sub-menu/:id", Authorization.Authenticated, Authorization.AdminRole, SubMenuController.GetDetailSubMenu);
router.patch("/sub-menu/:id", MenuValidation.CreateMenuValidaiton, Authorization.Authenticated, Authorization.AdminRole, SubMenuController.UpdateSubMenu);
router.delete("/sub-menu/:id", Authorization.Authenticated, Authorization.AdminRole, SubMenuController.SoftDeleteSubMenu);
router.delete("/sub-menu/permanent/:id", Authorization.Authenticated, Authorization.SuperUser, SubMenuController.PermanentDeleteSubMenu);

//  ROle Menu Access
router.post("/role-menu-access", MenuValidation.CreateRoleMenuAccessValidation, Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.CreateAccess)
router.get("/role-menu-access", Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.GetList)
router.get("/role-menu-access/get/all", Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.GetAll)
router.get("/role-menu-access/:id", Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.GetDetail)
router.patch("/role-menu-access/:id", MenuValidation.CreateRoleMenuAccessValidation, Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.UpdateAccess)
router.delete("/role-menu-access/:id", Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.SoftDelete)


export default router;
