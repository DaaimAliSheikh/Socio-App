const imageKitLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: string;
  quality: string;
}) => {
  ///for local images return the src as it, also next js recognizes it as a local image and applies the same optimizations as it does to normal local images
  if (
    !src.startsWith("/socio") 
  )
    return src;

  if (src[0] === "/") src = src.slice(1);
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  const paramsString = params.join(",");
  var urlEndpoint = "https://ik.imagekit.io/vmkz9ivsg4";
  if (urlEndpoint[urlEndpoint.length - 1] === "/")
    urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
  return `${urlEndpoint}/${src}?tr=${paramsString}`;
};

export default imageKitLoader;
