"use client"

import { useEffect } from "react";
import {Crisp} from "crisp-sdk-web";

export const CrispChat =()=>{

    useEffect(()=>{
        Crisp.configure("3fc86ff4-73ad-4ae1-a537-59ece9143e85")
    },[]);

    return null;
}