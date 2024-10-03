"use client"
import Heading from '@/components/heading';
import { Code2} from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from "react-markdown";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formSchema } from './constants';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import { Empty } from '@/components/empty';

type ChatCompletionRequestMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type Props = {};

const CodePage = (props: Props) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/code", { messages: newMessages });

      setMessages((current) => [
        ...current,
        userMessage,
        { role: "assistant", content: response.data.content }
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
        title="Code Generation"
        description="Generate code through descriptive prompts"
        icon={Code2}
        iconColor="text-yellow-500"
        bgColor="bg-yellow-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
              <FormField name='prompt'
                render={({ field }) => (
                  <FormItem className='col-span-12 lg:col-span-10'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        className='border-0 outline-none focus-visible:ring focus-visible:ring-transparent'
                        disabled={isLoading}
                        placeholder='e.g. Create a simple dropdown menu in react'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className='col-span-12 lg:col-span-2 w-full' disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className='space-y-4 mt-4'>
          {isLoading && (
            <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
              <Loader/>
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <div>
              <Empty label='No Code Generated' />
            </div>
          )}
          <div className='flex flex-col-reverse gap-y-4'>
            {messages.map((message) => (
              <div 
              key={message.content}
              className={cn(
                "p-8 w-full items-start gap-8-x rounded-lg",
                message.role === 'user' ? "bg-white border border-black.10" : "bg-muted"
              )}>
                {message.role === 'user' ? <UserAvatar/>:<BotAvatar/>}
              <ReactMarkdown
              components={{
                pre: ({node, ...props}) =>(
                  <div className='overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg'>
                    <pre {...props}/>
                  </div>
                ),
                code: ({node, ...props})=>(
                  <code className='bg-black/10 rounded-lg p-1'
                  {...props}/>
                )
              }}
              className="text-sm overflow-hidden leading-7">
                {message.content || ""}
              </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
