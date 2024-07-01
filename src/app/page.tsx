import { auth } from "@/auth";

const HomePage = async () => {
  const session = await auth();
  return <div>{JSON.stringify(session?.user)}</div>;
};

export default HomePage;
