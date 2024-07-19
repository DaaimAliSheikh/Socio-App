"use client";

import React, { useEffect } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useDropzone } from "react-dropzone";
import { Badge } from "./ui/badge";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "./ui/separator";
import { Loader2, Loader2Icon, X } from "lucide-react";
import EditProfile from "@/actions/EditProfile";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { User } from "@prisma/client";
import Image from "next/image";

export interface EditProfileFormInputs {
  name: string;
  bio: string;
  profileImage?: File[];
  coverImage?: File[];
}

const EditProfileForm = ({ user }: { user: User }) => {
  const {
    handleSubmit,
    register,
    unregister,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormInputs>({
    shouldUnregister: false,
    defaultValues: { name: user.name || "", bio: user.bio || "" },
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<EditProfileFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("bio", data.bio);

    ///if no files are selected, image arrays are undefined, not empty arrays
    if (data.profileImage) {
      formData.append("profileImage", data.profileImage[0]);
    }
    if (data.coverImage) {
      formData.append("coverImage", data.coverImage[0]);
    }

    const result = await EditProfile(formData, user.id);
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
            Drag and drop your file here, or click to upload a new profile image
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-2 ">
          {profileAcceptedFiles.length > 0 && (
            <p className=" text-nowrap">Selected Files:</p>
          )}
          {profileAcceptedFiles.map((file) => (
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
                  onClick={removeProfileFile(file)}
                >
                  <X size={17} />
                </Button>
              </div>
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
            Drag and drop your file here, or click to upload a new cover image
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-2 ">
          {coverAcceptedFiles.length > 0 && (
            <p className=" text-nowrap">Selected Files:</p>
          )}
          {coverAcceptedFiles.map((file) => (
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
                  onClick={removeCoverFile(file)}
                >
                  <X size={17} />
                </Button>
              </div>
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
          disabled={isSubmitting}
        >
          Save Changes
          {isSubmitting && <Loader2 className=" ml-2 animate-spin" />}
        </Button>
      </form>
    </ScrollArea>
  );
};

export default EditProfileForm;
