import { Request, Response } from "express";
import {prisma} from "../lib/prisma"



const addSubscription=async(req:Request,res:Response)=>{

    try {
        const {userId , planId , startDate} = req.body;

        if(!userId||!planId||!startDate) return res.status(404).json({message:"data not found!"});

        const user = await prisma.users.findUnique({where:{id:userId}});
        if(!user) return res.status(404).json({message:"user not found"});
        const plan = await prisma.plans.findUnique({where:{id:planId}});
        if(!plan) return res.status(404).json({message:"plan not found"});
        const subscription = await prisma.subscriptions.create({
            data:{
                userId,
                planId,
                startDate,
                isActive:true
            }
        })

        return res.status(200).json({message:"subscription started!"});

    } catch (error) {
        return res.status(500).json({message:"internal server error !",error})
    }
}

export {addSubscription}