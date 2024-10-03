"use client";

import Heading from "@/components/heading";
import { Speech } from "lucide-react";
import React, { useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";
import { EmptyMusic } from "@/components/emptymusic";

const TranscriptionPage = () => {
  const router = useRouter();
  const [transcription, setTranscription] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState<number>(0); // Timer state
  const [fileSize, setFileSize] = useState<number | null>(null); // File size state

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioURL = recordedAudio ? URL.createObjectURL(recordedAudio) : null;

  const formMethods = useForm({
    defaultValues: {
      prompt: "",
    },
  });

  const { handleSubmit, formState } = formMethods;
  const isLoading = formState.isSubmitting;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // Start recording audio using the browser's MediaRecorder API
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStatus("Recording in progress...");
      setRecordingTime(0); // Reset timer
      setFileSize(null); // Reset file size

      // Start the timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setRecordedAudio(audioBlob);
        setFileSize(audioBlob.size); // Store the file size
        audioChunksRef.current = [];
        setIsRecording(false);
        setRecordingStatus("Recording stopped.");

        // Stop the timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setRecordingStatus("Error accessing microphone.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  // Format the recording time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Format the file size for display
  const formatFileSize = (size: number): string => {
    if (size < 1024) return size + " B";
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    else return (size / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Handle form submission to send audio for transcription
  const onSubmit = async () => {
    try {
      const formData = new FormData();
      setTranscription(null);

      if (file) {
        formData.append("audio", file);
      } else if (recordedAudio) {
        formData.append("audio", recordedAudio, "recorded-audio.wav");
      } else {
        return;
      }

      const response = await axios.post("/api/transcription", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const transcriptionText = response.data.transcription;
      setTranscription(transcriptionText);

      formMethods.reset();
    } catch (error: any) {
      console.error("Error transcribing audio:", error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Audio Transcription"
        description="Upload an audio file or record audio to get its transcription"
        icon={Speech}
        iconColor="text-purple-500"
        bgColor="bg-purple-500/10"
      />
      <div className="px-4 lg:px-8">
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
            <FormItem className="col-span-12">
              <FormControl className="m-0 p-0">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  disabled={isLoading || isRecording}
                />
              </FormControl>
            </FormItem>

            {/* Record Audio */}
            <div className="col-span-12 flex justify-between items-center mt-4">
              {!isRecording ? (
                <Button type="button" onClick={startRecording} disabled={isLoading}>
                  Start Recording
                </Button>
              ) : (
                <Button type="button" onClick={stopRecording}>
                  Stop Recording
                </Button>
              )}
            </div>

            {/* Recording Status and Timer Display */}
            {isRecording && (
              <div className="col-span-12 text-red-500">
                {recordingStatus} - Timer: {formatTime(recordingTime)}
              </div>
            )}

            {/* File Size Display after Recording Stops */}
            {fileSize !== null && (
              <div className="col-span-12 text-green-500">
                Recorded File Size: {formatFileSize(fileSize)}
              </div>
            )}

            {/* Play Recorded Audio */}
            {recordedAudio && (
              <div className="col-span-12 mt-4">
                <h3 className="text-lg font-medium">Recorded Audio:</h3>
                <audio controls>
                  {audioURL && <source src={audioURL} type="audio/wav" />}
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Submit Button */}
            <Button className="col-span-12 w-full cursor-pointer" disabled={isLoading || (!file && !recordedAudio)}>
              Transcribe
            </Button>
          </form>
        </FormProvider>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {!transcription && !isLoading && (
            <div>
              <EmptyMusic label="No transcription available" />
            </div>
          )}
          {transcription && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium">Transcription:</h3>
              <p className="mt-2">{transcription}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage;
