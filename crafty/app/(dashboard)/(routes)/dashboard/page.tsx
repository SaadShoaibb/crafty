import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Code2, File, FileVideo2, ImageIcon, MessageCircle, Music2, Speech } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    label:"Chat",
    icon:MessageCircle,
    color: "text-sky-500",
    bgColor:"bg-sky-500/10",
    href: "/chat",
  },
  {
    label:"Generate Video",
    icon:FileVideo2,
    color: "text-green-500",
    bgColor:"bg-green-500/10",
    href: "/video",
  },
  {
    label:"Generate Image",
    icon:ImageIcon,
    color: "text-pink-700",
    bgColor:"bg-pink-700/10",
    href: "/image",
  },
  {
    label:"Audio Transcription",
    icon:Speech,
    color: "text-purple-700",
    bgColor:"bg-purple-700/10",
    href: "/speech",
  },
  {
    label:"Generate Music",
    icon:Music2,
    color: "text-red-700",
    bgColor:"bg-red-700/10",
    href: "/music",
  },
  {
    label:"Generate Code",
    icon:Code2,
    color: "text-yellow-500",
    bgColor:"bg-yellow-500/25",
    href: "/code",
  },
]


const DashboardPage =() => {
  return (
    <>
    <div>
      <div className="mb=8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Unleash your imagination through AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Craft whatever you want through creative prompts - Bring your imagination to reality
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) =>(
          <Link href={tool.href} key={tool.href}>
          <Card 
          key={tool.href}
          className="p-4 border-black/5 flex items-center justify-between mt-5 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}
              </div>
            </div>
            <ArrowRight className="w-5 h-5"/>
          </Card>
          </Link>
        ))}

      </div>
    </div>
    </>
  );
}

export default DashboardPage;
