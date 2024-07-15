"use server";
import { db } from "@/db/db";
import imagekit from "@/lib/imagekit";

const EditProfile = async (data: FormData, userId: string) => {
  try {
    if (data.get("coverImage") || data.get("profileImage")) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { image: true, coverImage: true },
      });
      const uploadValues: {
        name: string;
        bio: string;
        image?: string;
        coverImage?: string;
      } = { name: data.get("name") as string, bio: data.get("bio") as string };

      if (data.get("profileImage")) {
        //delete old profile image if exists
        if (user?.image) {
          const files = await imagekit.listFiles({ path: "/socio/" });
          const fileId = files.find((f) => {
            return f.filePath === user?.image;
          })?.fileId as string;
          await imagekit.deleteFile(fileId);
        }
        const { filePath } = await imagekit.upload({
          file: Buffer.from(
            await (data.get("profileImage") as File).arrayBuffer()
          ),
          fileName:
            (data.get("profileImage") as File).name +
            Date.now() +
            Math.random() * 100,
          folder: `/socio/`,
        });
        uploadValues.image = filePath;
      }
      if (data.get("coverImage")) {
        //delete old profile image if exists
        if (user?.coverImage) {
          const files = await imagekit.listFiles({ path: "/socio/" });
          const fileId = files.find((f) => {
            return f.filePath === user?.coverImage;
          })?.fileId as string;
          await imagekit.deleteFile(fileId);
        }
        const { filePath } = await imagekit.upload({
          file: Buffer.from(
            await (data.get("coverImage") as File).arrayBuffer()
          ),
          fileName:
            (data.get("coverImage") as File).name +
            Date.now() +
            Math.random() * 100,
          folder: `/socio/`,
        });
        uploadValues.coverImage = filePath;
      }

      await db.user.update({
        where: { id: userId },
        data: uploadValues,
      });
    }

    return { success: "Profile successfully updated" };
  } catch (e) {
    console.log(e);
    return { error: "Error updating profile. Please try again." };
  }
};

export default EditProfile;

// imagekit.upload({
//   file: Buffer.from(await data.get("profileImage").arrayBuffer()),
//   fileName: value.name,
//   folder: `/socio/`,
// })
