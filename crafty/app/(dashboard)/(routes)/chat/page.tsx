"use client";
import Heading from "@/components/heading";
import { MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Empty } from "@/components/empty";

type ChatCompletionRequestMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type Props = {};

const ChatPage = (props: Props) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const formatResponse = (content: string) => {
    const formattedContent = content
      .replace(/### (.*?)(\n|$)/g, "<strong>$1</strong><br>")
      .replace(/## (.*?)(\n|$)/g, "<strong>$1</strong><br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .split("\n")
      .map((paragraph, idx) => `<p key=${idx}>${paragraph}</p>`)
      .join("");

    return formattedContent;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      // Send the request to the AI API endpoint
      const response = await axios.post("/api/chat", { messages: newMessages });

      // Format the assistant's response content
      const formattedResponseContent = formatResponse(response.data.content);

      setMessages((current) => [
        ...current,
        userMessage,
        { role: "assistant", content: formattedResponseContent },
      ]);

      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Chat"
        description="Talk with CraftyAI"
        icon={MessageCircle}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Ask me anything!"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <div>
              <Empty label="No Prompt Entered" />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full items-start gap-8-x rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black.10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                {/* Use dangerouslySetInnerHTML to render the formatted response */}
                <p
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
