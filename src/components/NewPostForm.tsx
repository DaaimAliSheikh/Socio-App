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
import { Loader2, X } from "lucide-react";
import PublishPost from "@/actions/PublishPost";
import { Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import updatePost from "@/actions/updatePost";
import Image from "next/image";

export interface PostFormInputs {
  description: string;
  media?: File[];
}

const NewPostForm = ({ userId, post }: { userId: string; post?: Post }) => {
  const {
    handleSubmit,
    register,
    unregister,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormInputs>({
    shouldUnregister: false,
    defaultValues: {
      description: post?.description || "",
      media: [],
    },
  });
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<PostFormInputs> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "media" && value) {
        value.forEach((file: File) => {
          formData.append(file.name, file);
        });
      } else {
        formData.append(key, value);
      }
    });
    const result = post
      ? await updatePost(formData, post.id)
      : await PublishPost(formData, userId);
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
        <div className="grid    w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="description">Post Description*</Label>
          <Textarea
            className="resize-none mt-1"
            {...register("description", {
              required: "Post Description is required",
            })}
            rows={6}
            id="description"
            placeholder={
              post?.description || "This is my cool post's description!"
            }
          />
          <p className="text-red-500">{errors.description?.message}</p>
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
            {post
              ? "Drag 'n' drop new files to replace the old ones"
              : "Drag 'n' drop some files here, or click to select files"}

            <br />
            <span className="font-bold">(Max 5)</span>
          </p>
        </div>
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
          {post ? "Save Changes" : "Publish"}
          {isSubmitting ? <Loader2 className="animate-spin ml-2" /> : null}
        </Button>
      </form>
    </ScrollArea>
  );
};

export default NewPostForm;
