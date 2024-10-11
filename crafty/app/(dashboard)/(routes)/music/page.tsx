"use client";

import Heading from "@/components/heading";
import { Music2 } from "lucide-react";
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
import { EmptyMusic } from "@/components/emptymusic";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const MusicPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
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
      setMusicUrl(null); // Clear previous music URL
      setDownloadUrl(null); // Clear previous download URL

      // Send request to the API with the prompt
      const response = await axios.post("/api/music", {
        inputs: values.prompt,
      }, {
        responseType: "arraybuffer", // Receive binary data
      });

      // Create a Blob from the audio data
      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob); // Create a blob URL for the audio

      // Set the blob URL in the state for playing and downloading
      setMusicUrl(url);
      setDownloadUrl(url); // We can reuse the same URL for downloading

      form.reset();
    } catch (error: any) {
      if(error?. response?.status === 403 ){
        proModal.onOpen();
      } else{
        toast.error("Something went wrong")
      }
      console.error("Error generating music:", error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Generate music through prompts"
        icon={Music2}
        iconColor="text-red-500"
        bgColor="bg-red-500/10"
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
                        placeholder="e.g. a funky house with 80s hip hop vibes"
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
          {!musicUrl && !isLoading && (
            <div>
              <EmptyMusic label="No Music generated" />
            </div>
          )}
          {musicUrl && (
            <>
              {/* Audio Player */}
              <audio controls className="w-full mt-8">
                <source src={musicUrl} type="audio/mpeg" />
              </audio>

              {/* Download Button */}
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="crafted-music.mp3" // Name of the file when downloaded
                  className="mt-4 inline-block bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Download as MP3
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
