"use server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.NEXT_PRIVATE_IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

const PublishStory = async (data: FormData) => {
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

export default PublishStory;
