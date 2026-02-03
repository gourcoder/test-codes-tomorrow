import { Request, Response } from "express";
import {prisma} from "../lib/prisma"



const setPlans=async(req:Request,res:Response)=>{

    try {
        const {name ,monthlyQuota ,extraChargePerUnit } = req.body;
        const plan = await prisma.plans.create({
            data:{
                name,
                monthlyQuota,
                extraChargePerUnit
            }
        })
        return res.status(200).json({message:"Plan created!"});
    } catch (error) {
        return res.status(500).json({message:"internal server error !",error});
    }
}

export {setPlans}