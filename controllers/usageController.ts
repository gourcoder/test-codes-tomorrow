import { Request , Response } from "express";
import {prisma} from "../lib/prisma";




const usageEntry =async (req:Request,res:Response)=>{
    try {
        const {userId , action , usedUnits} = req.body;
        if(!userId || usedUnits<0 || !action) return res.status(400).json({message:"please send valid data!"});

        const user = prisma.users.findUnique({
            where:{
                id:userId
            }
        })

        if(!user) return res.status(400).json({message:"user not found!"});

        await prisma.usageRecords.create({
            data:{
                userId,
                action,
                usedUnits
            }
        })
        return res.status(200).json({message:"usagedone"})
    } catch (error) {
        return res.status(500).json({message:"internal server error !"})
    }
}

export {usageEntry};