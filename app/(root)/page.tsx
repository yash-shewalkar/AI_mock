import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";


async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    user ? getInterviewsByUserId(user.id) : null,
    user ? getLatestInterviews({ userId: user.id }) : null,
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (allInterview?.length ?? 0) > 0;

  return (
    <>
  
      <section className="w-full flex flex-col items-center gap-6 py-12 px-4">
        <div className="flex flex-col gap-6 w-full max-w-4xl items-center text-center px-4">
          <h2 className="text-4xl font-bold max-w-3xl text-blue-300">
            Interview Preparation Made Easy 💡🤖🎤
          </h2>
          <p className="text-xl max-w-3xl">
          Prepare for your next job interview with AI.
          </p>

          <Button  className="btn-primary w-full max-w-xs text-lg bg-blue-600">
            <Link href="/create-interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/final.png"
          alt="robo-dude"
          width={600}
          height={600}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="mx-auto text-blue-400">Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="mx-auto text-blue-400" >Check Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
