"use server";
import imagekit from "@/lib/imagekit";

const EditProfile = async (data: FormData) => {
  const uploadPromises = Array.from(data.keys()).map(async (key) => {
    const value = data.get(key);
    if (value instanceof File) {
      return imagekit.upload({
        file: Buffer.from(await value.arrayBuffer()),
        fileName: value.name,
        folder: `/socio/`,
      });
    }
  });
  if (uploadPromises)
    return (await Promise.all(uploadPromises)).map((item) => item?.filePath);
};

export default EditProfile;
