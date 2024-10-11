"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const reviews =[
    {
        name:"Saad",
        avatar:"S",
        title:"Software Developer",
        description:"This tool is the best I've used for AI Generation!"
    },
    {
        name:"Umer",
        avatar:"U",
        title:"Data Engineer",
        description:"The instant generations make this tool a great time saver!"
    },
    {
        name:"Askari",
        avatar:"A",
        title:"Blockchain Specialist",
        description:"The easy to navigate UI of the app just makes me love it even more!"
    },
    {
        name:"Huzaifa",
        avatar:"H",
        title:"Sales Specialist",
        description:"CraftyAI helped me increase my sales with its creative generations!, and continues to do so"
    },
]


export const LandingContent = ()=>{
    return(
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Customer Reviews
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {reviews.map((item)=>(
                    <Card key={item.description} className="bg-[#192339] border-none text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <div>
                                    <p className="text-lg">{item.name}</p>
                                    <p className="text-zinc-400 text-sm">{item.title}</p>
                                </div>
                            </CardTitle>
                            <CardContent className="pt-4 px-0">
                                {item.description}
                            </CardContent>

                        </CardHeader>

                    </Card>
                ))}

            </div>
        </div>
    )
}