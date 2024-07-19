"use client";

import React, { useEffect, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useDropzone } from "react-dropzone";
import { Badge } from "./ui/badge";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "./ui/separator";
import { Loader2, X } from "lucide-react";
import PublishStory from "@/actions/PublishStory";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";

export interface StoryFormInputs {
  media: File[];
}

const NewStoryForm = ({ userId }: { userId: string }) => {
  const {
    handleSubmit,
    register,
    unregister,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<StoryFormInputs>({ shouldUnregister: false });
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit: SubmitHandler<StoryFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append("media", data?.media[0]);

    const result = await PublishStory(formData, userId);
    if (result?.error)
      toast({
        duration: 3000,
        variant: "destructive",
        description: result.error,
      });
    else {
      toast({
        duration: 3000,
        description: result.success,
      });
      router.refresh();
    }
  };

  useEffect(() => {
    register("media", { required: "Please select a file" });
    return () => {
      unregister("media");
    };
  }, [register, unregister]);

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpeg", ".jpg"],
        "image/gif": [".gif"],
        "image/webp": [".webp"],
      },
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        setValue("media", acceptedFiles, { shouldValidate: true });
      },
    });

  const removeFile = (file: File) => () => {
    acceptedFiles.splice(acceptedFiles.indexOf(file), 1);
    setValue("media", acceptedFiles, { shouldValidate: true });
  };

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.name}>
        <Badge variant={"outline"}>{file.name}</Badge>
        <ul>
          {errors.map((e) => (
            <li className="text-red-500 ml-2" key={e.code}>
              {e.message}
            </li>
          ))}
        </ul>
      </li>
    );
  });

  return (
    <ScrollArea className="w-full flex  h-[50vh]  mt-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full ml-1 space-y-4 text-sm"
      >
        <Label htmlFor="media">Select a photo for your story</Label>
        <div
          {...getRootProps({
            className:
              "dropzone w-[95%] border-dashed border p-10 flex justify-center items-center hover:cursor-pointer hover:bg-secondary hover:border-foreground",
          })}
        >
          <input id="media" {...getInputProps()} />
          <p className="text-center">
            Drag and drop your file here, or click to upload
            <br />
            <span className="font-bold">(Max 1)</span>
          </p>
        </div>
        <p className="p-1 text-red-500 mx-auto">{errors?.media?.message}</p>
        <ul className="flex flex-wrap items-center gap-2 ">
          {acceptedFiles.length > 0 && (
            <p className=" text-nowrap">Selected Files:</p>
          )}
          {acceptedFiles.map((file) => (
            <li key={file.name}>
              <div className="relative">
                <Image
                  alt="post images"
                  sizes="100vw"
                  src={URL.createObjectURL(file)}
                  height={100}
                  width={100}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant={"outline"}
                  size={"icon"}
                  className="p-0 absolute top-1 right-1 rounded-full w-5 h-5 ml-2"
                  onClick={removeFile(file)}
                >
                  <X size={17} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {fileRejectionItems.length > 0 ? (
          <>
            <Separator />
            <p> Rejected Files:</p>
            {fileRejectionItems}
          </>
        ) : null}

        <Button
          className="self-center text-foreground hover:bg-secondary"
          type="submit"
          disabled={isSubmitting}
        >
          Publish {isSubmitting && <Loader2 className=" ml-2 animate-spin" />}
        </Button>
      </form>
    </ScrollArea>
  );
};

export default NewStoryForm;
