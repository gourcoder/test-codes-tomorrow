import {prisma} from "../lib/prisma"
import { Request,Response } from "express"


const getCurrentMonthRange=()=>{
    const start = new Date();
    start.setDate(1);
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setMonth(end.getMonth()+1);

    return {start , end}
}

const createUser=async (req:Request,res:Response)=>{
 
    try {
        const name = req.body.name
    if(!name) return res.status(401).json({message:"Data not found !"});
    const user= await prisma.users.create({
        data:{
            name:name
        }
    })  
    return res.status(201).json({message:"User created successfully",user:user})
    } catch (error) {
        res.status(500).json({message:"failed to create!"})
    }
}



const getUser=async (req:Request,res:Response)=>{
 
    try {
        const id = req.params.id
    if(!id) return res.status(401).json({message:"Data not found !"});
    const user= await prisma.users.findUnique({where:{
        id : id as string
    }})
    return res.status(201).json({message:"User created successfully",user:user})
    } catch (error) {
        res.status(500).json({message:"failed to create!"})
    }
}

const currentUsage=async (req:Request,res:Response)=>{
 
    try {
      const id = req.params.id;
      const {start , end } = getCurrentMonthRange();
      const subscription = await prisma.subscriptions.findFirst({
        where :{
            userId:id as string,
            isActive:true
        },
        include:{
            plan:true
        }
      })

      if(!subscription) return res.status(404).json({message:"No active subscription !"});

      const usage = await prisma.usageRecords.aggregate({
        where:{
            userId:id as string,
            createdAt :{
                gte:start,
                lt:end
            }
        },
        _sum:{usedUnits:true}

      })

      const totalUsed = usage._sum.usedUnits ?? 0;
      return res.json({
        totalUsed,
        remainingUnints:Math.max(subscription.plan.monthlyQuota - totalUsed),
        plan:{
            id:subscription.plan.id,
            name:subscription.plan.name,
            monthluQuota:subscription.plan.monthlyQuota
        }

    })
    } catch (error) {
        res.status(500).json({message:"failed to get current usage !"})
    }
}

const billingSummmary=async (req:Request,res:Response)=>{
    try {
        const id = req.params.id;
        const {start,end} = getCurrentMonthRange();
        const subscription = await prisma.subscriptions.findFirst({
            where :{
                userId:id as string,
                isActive:true
            },
            include:{
                plan:true
            }
        })
        if(!subscription) return res.status(404).json({message:"No active subscription!"});
        const usage = await prisma.usageRecords.aggregate({
            where:{
                userId:id as string,
                createdAt :{
                    gte:start,
                    lt:end
                }
            },
            _sum:{usedUnits:true}
    
          })
          const totalUsage = usage._sum.usedUnits ?? 0;
          const quota = subscription.plan.monthlyQuota;
          const extraUnits = Math.max(totalUsage - quota,0);
          const extraCharges = extraUnits*Number(subscription.plan.extraChargePerUnit);
          return res.status(200).json({
            totalUsage,
            quota,
            extraUnits,
            extraCharges:Number(extraCharges.toFixed(2)),
            plan:subscription.plan,
          })
    } catch (error) {
        return res.status(500).json({message:"internal server error !", error})
    }
}

export {createUser , getUser , currentUsage, billingSummmary}