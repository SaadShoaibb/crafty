"use client";

import Heading from "@/components/heading";
import { Video } from "lucide-react";
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
import { Empty } from "@/components/empty";

const VideoPage = () => {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState<string>();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null); // For download

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideoUrl(undefined); // Clear previous video URL
      setDownloadUrl(null); // Clear previous download URL

      // Send request to the API with the prompt
      const response = await axios.post("/api/video", {
        inputs: values.prompt,
      }, {
        responseType: "arraybuffer", // Receive binary data
      });

      // Create a Blob from the video data
      const blob = new Blob([response.data], { type: "video/mp4" });
      const url = URL.createObjectURL(blob); // Create a blob URL for the video

      // Set the blob URL in the state for playing and downloading
      setVideoUrl(url);
      setDownloadUrl(url); // We can reuse the same URL for downloading

      form.reset();
    } catch (error: any) {
      console.error("Error generating video:", error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Generate videos through creative prompts"
        icon={Video}
        iconColor="text-green-500"
        bgColor="bg-green-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
              <FormField name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="e.g. a leopard running in a forest"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
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
          {!videoUrl && !isLoading && (
            <div>
              <Empty label="No video generated" />
            </div>
          )}
          {videoUrl && (
            <>
              {/* Video Player */}
              <video className="w-full aspect-video mt-8 rounded-lg border bg-black" controls>
                <source src={videoUrl} />
              </video>

              {/* Download Button */}
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="crafted-video.mp4" // Name of the file when downloaded
                  className="mt-4 inline-block bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Download as MP4
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
