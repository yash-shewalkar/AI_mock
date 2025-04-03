import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <section className="max-w-4xl mx-auto p-6 bg-slate-900 shadow-md rounded-lg text-white">
      <h1 className="text-3xl font-bold text-center text-blue-400 mb-4">
        Interview Feedback: <span className="text-primary">{interview.role}</span>
      </h1>

      <div className="flex flex-wrap justify-center gap-6 mb-6 text-white">
        {/* Overall Impression */}
        <div className="flex items-center gap-2 text-white">
          <Image src="/star.svg" width={22} height={22} alt="star" />
          <p className="text-white">
            <span className="font-bold text-primary">{feedback?.totalScore}</span>/100 Overall Impression
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-white">
          <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
          <p className="text-white">
            {feedback?.createdAt
              ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
              : "N/A"}
          </p>
        </div>
      </div>

      <hr className="my-4" />

      <p className="text-lg text-white mb-4">{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-3">Performance Breakdown</h2>
        <div className="space-y-4">
          {feedback?.categoryScores?.map((category, index) => (
            <div key={index} className="p-3 bg-slate-600 rounded-lg">
              <p className="font-bold text-blue-200">
                {index + 1}. {category.name} ({category.score}/100)
              </p>
              <p className="text-white">{category.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-green-600">Key Strengths</h3>
        <ul className="list-disc list-inside text-gray-700">
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      {/* Areas for Improvement */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-red-600">Areas for Improvement</h3>
        <ul className="list-disc list-inside text-gray-700">
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary">Back to Dashboard</p>
          </Link>
        </Button>

        <Button variant="primary">
          <Link href={`/interview/${id}`} className="flex w-full justify-center">
            <p className="text-sm font-semibold text-white">Retake Interview</p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
