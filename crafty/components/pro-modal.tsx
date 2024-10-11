"use client"

import { useProModal } from "@/hooks/use-pro-modal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge";
import { Check, CircleFadingArrowUp, Code2, FileVideo2, ImageIcon, MessageCircle, Music2, Speech } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";


const tools = [
    {
      label:"Chat",
      description:"Unlimited chats with CraftyAI!",
      icon:MessageCircle,
      color: "text-sky-500",
      bgColor:"bg-sky-500/10",

    },
    {
      label:"Generate Video",
      description:"Convert text into videos!",
      icon:FileVideo2,
      color: "text-green-500",
      bgColor:"bg-green-500/10",
 
    },
    {
      label:"Generate Image",
      description:"Convert text into images!",
      icon:ImageIcon,
      color: "text-pink-700",
      bgColor:"bg-pink-700/10",

    },
    {
      label:"Audio Transcription",
      description:"Convert large audio to text!",
      icon:Speech,
      color: "text-purple-700",
      bgColor:"bg-purple-700/10",

    },
    {
      label:"Generate Music",
      description:"Generate genre based music!",
      icon:Music2,
      color: "text-red-700",
      bgColor:"bg-red-700/10",

    },
    {
      label:"Generate Code",
      description:"Get hassle free code!",
      icon:Code2,
      color: "text-yellow-500",
      bgColor:"bg-yellow-500/25",
    },
  ]

export const ProModal = ()=>{

    const proModal = useProModal();
    const [loading,setLoading] = useState(false);

    const onSubscribe = async()=>{
        try{
            setLoading(true);
            const response = await axios.get("/api/stripe");

            window.location.href = response.data.url; 
        }
        catch(error){
            toast.error("Something went wrong")
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 font-bold py-1">
                        Upgrade Plan
                        <Badge className="uppercase text-sm py-1 bg-black" variant="premium">
                            pro
                        </Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                        {tools.map((tool)=>(
                            <Card
                            key={tool.label}
                            className="p-3 border-black/5 flex items-center justify-between">
                                <div className="flex items-center gap-x-4">
                                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                        <tool.icon className={cn("w-6 h-6", tool.color)}/>
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {tool.label}
                                    </div>
                                </div>
                                <p className="font-light text-sm flex flex-row justify-start">
                                    {tool.description}
                                    </p>
                                <Check className="text-primary w-5 h-5"/>
                            </Card>
                        ))}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button disabled={loading} onClick={onSubscribe} size="lg" variant="premium" className="w-full bg-black hover:bg-neutral-900">
                        Upgrade
                        <CircleFadingArrowUp className="w-4 h-4 ml-2 fill-white"/>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}