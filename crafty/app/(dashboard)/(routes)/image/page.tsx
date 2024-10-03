"use client";
import Heading from '@/components/heading';
import { Download, DownloadIcon, ImageIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { amountOptions, formSchema, resolutionOptions } from './constants';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/loader';
import { Empty } from '@/components/empty';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';

const ImagePage = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]); // Clear the images before generating new ones
      console.log("Form Values:", values);

      // Post form values to the API
      const response = await axios.post("/api/image", {
        prompt: values.prompt,
        amount: values.amount,
        resolution: values.resolution
      });

      console.log("Response Data:", response.data);

      // Handle the array of base64 images
      const urls = Array.isArray(response.data.images) ? response.data.images : [];
      
      // Make sure to set multiple images in the state
      setImages(urls);
      form.reset();
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Generate images through descriptive prompts"
        icon={ImageIcon}
        iconColor="text-pink-400"
        bgColor="bg-pink-500/10"
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
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of a leopard in the mountains"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate'}
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <div>
              <Empty label="No Images Generated." />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {images.map((src, index) => (
              src && (
                <Card key={index} className="rounded-lg overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      alt={`generated-${index}`}
                      src={src} // Base64 image source
                      className="w-full h-full object-cover"
                    />
                    {/* Download button */}
                    <a
                      href={src} // Use the base64 image URL
                      download={`generated-image-${index + 1}.png`} // Set download name
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-md"
                    >
                      <DownloadIcon className="h-6 w-6" />
                    </a>
                  </div>
                </Card>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
