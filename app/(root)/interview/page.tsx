import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
    <h2 className="mx-auto text-blue-400" >Get Ready for the Interview!</h2>

      <Agent
        userName={user?.name || "Guest"}
        userId={user?.id}
        // profileImage={user?.profileURL}
        type="generate"
      />
    </>
  );
};

export default Page;
