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
import EditProfile from "@/actions/EditProfile";

export interface EditProfileFormInputs {
  name: string;
  bio: string;
  profileImage?: File[];
  coverImage?: File[];
}

const onSubmit: SubmitHandler<EditProfileFormInputs> = async (data) => {
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

  const result = await EditProfile(formData);
  console.log(result);
  ///to do, not send these links here t client but save them in the db on the server action
};

const EditProfileForm = () => {
  const {
    handleSubmit,
    register,
    unregister,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormInputs>({ shouldUnregister: false });

  useEffect(() => {
    register("profileImage");
    register("coverImage");
    return () => {
      unregister("profileImage");
      unregister("coverImage");
    };
  }, [register, unregister]);

  ///profile Image drop zone
  const {
    acceptedFiles: profileAcceptedFiles,
    fileRejections: profileFileRejections,
    getRootProps: getProfileRootProps,
    getInputProps: getProfileInputProps,
  } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    onDrop: (profileAcceptedFiles) => {
      setValue("profileImage", profileAcceptedFiles, { shouldValidate: true });
    },
  });

  const removeProfileFile = (file: File) => () => {
    profileAcceptedFiles.splice(profileAcceptedFiles.indexOf(file), 1);
    setValue("profileImage", profileAcceptedFiles, { shouldValidate: true });
  };

  const profileFileRejectionItems = profileFileRejections.map(
    ({ file, errors }) => {
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
    }
  );

  //Cover Image drop zone
  const {
    acceptedFiles: coverAcceptedFiles,
    fileRejections: coverFileRejections,
    getRootProps: getCoverRootProps,
    getInputProps: getCoverInputProps,
  } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    onDrop: (coverAcceptedFiles) => {
      setValue("coverImage", coverAcceptedFiles, { shouldValidate: true });
    },
  });

  const removeCoverFile = (file: File) => () => {
    coverAcceptedFiles.splice(coverAcceptedFiles.indexOf(file), 1);
    setValue("coverImage", coverAcceptedFiles, { shouldValidate: true });
  };

  const coverFileRejectionItems = coverFileRejections.map(
    ({ file, errors }) => {
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
    }
  );

  return (
    <ScrollArea className="w-full h-[80vh]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full ml-1 space-y-4 text-sm"
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Name*</Label>
          <Input
            {...register("name", {
              required: "Name is required",
            })}
            id="name"
            placeholder="Your name"
            className="h-[2rem] mt-1"
          />
          <p className="text-red-500">{errors.name?.message as string}</p>
        </div>
        <div className="grid    w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            className="resize-none mt-1"
            {...register("bio")}
            id="bio"
            placeholder="Tell people something about you!"
          />
          <p className="text-red-500">{errors.bio?.message}</p>
        </div>

        {
          //profile image render
        }

        <Label htmlFor="profileImage">Profile Photo</Label>
        <div
          {...getProfileRootProps({
            className:
              "dropzone w-[95%] border-dashed border p-10 flex justify-center items-center hover:cursor-pointer hover:bg-secondary hover:border-foreground",
          })}
        >
          <input id="profileImage" {...getProfileInputProps()} />
          <p className="text-center">
            Drag 'n' drop your file here, or click to upload
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-2 ">
          {profileAcceptedFiles.length > 0 && (
            <p className=" text-nowrap">Selected Files:</p>
          )}
          {profileAcceptedFiles.map((file) => (
            <li key={file.name}>
              <Badge variant="outline">
                {file.name}
                <Button
                  type="button"
                  variant={"ghost"}
                  size={"icon"}
                  className="p-0 rounded-full w-6 h-6 ml-2"
                  onClick={removeProfileFile(file)}
                >
                  <X size={17} />
                </Button>
              </Badge>
            </li>
          ))}
        </ul>
        {profileFileRejectionItems.length > 0 ? (
          <>
            <Separator />
            <p> Rejected Files:</p>
            {profileFileRejectionItems}
          </>
        ) : null}
        {
          //cover image render
        }
        <Label htmlFor="coverImage">Cover Photo</Label>
        <div
          {...getCoverRootProps({
            className:
              "dropzone w-[95%] border-dashed border p-10 flex justify-center items-center hover:cursor-pointer hover:bg-secondary hover:border-foreground",
          })}
        >
          <input id="coverImage" {...getCoverInputProps()} />
          <p className="text-center">
            Drag 'n' drop your file here, or click to upload
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-2 ">
          {coverAcceptedFiles.length > 0 && (
            <p className=" text-nowrap">Selected Files:</p>
          )}
          {coverAcceptedFiles.map((file) => (
            <li key={file.name}>
              <Badge variant="outline">
                {file.name}
                <Button
                  type="button"
                  variant={"ghost"}
                  size={"icon"}
                  className="p-0 rounded-full w-6 h-6 ml-2"
                  onClick={removeCoverFile(file)}
                >
                  <X size={17} />
                </Button>
              </Badge>
            </li>
          ))}
        </ul>
        {coverFileRejectionItems.length > 0 ? (
          <>
            <Separator />
            <p> Rejected Files:</p>
            {coverFileRejectionItems}
          </>
        ) : null}

        <Button
          className="self-center text-foreground hover:bg-secondary"
          type="submit"
        >
          Save Changes
        </Button>
      </form>
    </ScrollArea>
  );
};

export default EditProfileForm;
