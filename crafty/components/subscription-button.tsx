"use client"

import { CircleFadingArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface SubscriptionButtonProps{
    isPro:boolean;
};


export const SubscriptionButton = ({
    isPro = false
}:SubscriptionButtonProps) =>{

    const [loading,setLoading] = useState(false);

    const onClick = async()=>{
        try{
            setLoading(true);
            const response = await axios.get("/api/stripe");

            window.location.href = response.data.url;
        }
        catch (error){
            toast.error("Something went wrong")
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <Button className={isPro? "":"bg-black hover:bg-black/85"} disabled={loading} variant={isPro ? "default" : "premium"} onClick={onClick}>
            {isPro ? "Manage Subscription" : "Upgrade to Pro!"}
            {!isPro && <CircleFadingArrowUp className="w-4 h-4 ml-2 fill-white"/>}
        </Button>
    )
}