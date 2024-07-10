"use client";

import React, { useEffect, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useDropzone } from "react-dropzone";
import { Badge } from "./ui/badge";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "./ui/separator";
import { X } from "lucide-react";
import PublishPost from "@/actions/PublishPost";

export interface PostFormInputs {
  title: string;
  description: string;
  media?: File[];
}

const onSubmit: SubmitHandler<PostFormInputs> = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "media") {
      value.forEach((file: File) => {
        formData.append(file.name, file);
      });
    } else {
      formData.append(key, value);
    }
  });

  const result = await PublishPost(formData);
  console.log(result);
  ///to do, not send these links here t client but save them in the db on the server action
};

const NewPostForm = () => {
  const {
    handleSubmit,
    register,
    unregister,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormInputs>({ shouldUnregister: false });

  useEffect(() => {
    register("media");
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
      maxFiles: 5,
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
    <ScrollArea className="w-full h-[80vh]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full ml-1 space-y-4 text-sm"
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="title">Post Title*</Label>
          <Input
            {...register("title", {
              required: "Post Title is required",
            })}
            id="title"
            placeholder="This is my cool post's title!"
            className="h-[2rem] mt-1"
          />
          <p className="text-red-500">{errors.title?.message as string}</p>
        </div>
        <div className="grid    w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="description">Post Description*</Label>
          <Textarea
            className="resize-none mt-1"
            {...register("description", {
              required: "Post Description is required",
            })}
            id="description"
            placeholder="This is my cool post's description!"
          />
          <p className="text-red-500">
            {errors.description?.message as string}
          </p>
        </div>

        <Label htmlFor="media">
          Post Photos <span className="font-bold">(optional)</span>
        </Label>
        <div
          {...getRootProps({
            className:
              "dropzone w-[95%] border-dashed border p-10 flex justify-center items-center hover:cursor-pointer hover:bg-secondary hover:border-foreground",
          })}
        >
          <input id="media" {...getInputProps()} />
          <p className="text-center">
            Drag 'n' drop some files here, or click to select files
            <br />
            <span className="font-bold">(Max 5)</span>
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-2 ">
          <p className=" text-nowrap">Selected Files:</p>
          {acceptedFiles.map((file) => (
            <li key={file.name}>
              <Badge variant="outline">
                {file.name}
                <Button
                  type="button"
                  variant={"ghost"}
                  size={"icon"}
                  className="p-0 rounded-full w-6 h-6 ml-2"
                  onClick={removeFile(file)}
                >
                  <X size={17} />
                </Button>
              </Badge>
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
        >
          Publish
        </Button>
      </form>
    </ScrollArea>
  );
};

export default NewPostForm;
