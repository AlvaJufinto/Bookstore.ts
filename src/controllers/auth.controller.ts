import { Request, Response } from "express";
import bcrypt from "bcrypt";

import AdminModel from "./../models/Admin.model";
import { signJwt } from "./../utils/jwt.util";

export async function authLogin(req: Request, res: Response) {
    const { username, password } = req.body;

    let admin;

    admin = await AdminModel.findOne({ 
        username: username as string    
    });

    if(admin) {
        const match = await bcrypt.compare(password, admin.password);
        const token = await signJwt(admin._id as unknown as string);

        if(match) {
            return res.status(200).json({
                ok : true,
                message : "Login Success",
                token,
            })
        }
    }
    return res.status(401).json({
        ok: false,
        message: "Wrong password or username"
    })
} 

export async function getAuthData(req: Request, res: Response) {
    const adminId = res.locals.user.uid;
    const admin = await AdminModel.findOne({
        id: adminId
    })
    if(admin) {
        return res.status(200).json({
            ok: true,
            message: "Data retrieved successfully",
            data: {
                username: admin?.username,
                fullname: admin?.fullname,
                description: admin?.description,
                role: admin?.role,
            }
        })
    }
    return res.status(404).json({
        ok: false,
        message: "Admin not found",
    })
} 

