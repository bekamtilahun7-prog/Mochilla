import { useState } from "react";
import { Clock, Flag, CheckCircle2 } from "lucide-react";

const mockExamQuestions = [
  {
    id: 1,
    question: "Evaluate the integral: ∫(3x² + 2x - 5) dx",
    options: ["x³ + x² - 5x + C", "3x³ + 2x² - 5x + C", "x³ + x² + 5x + C", "6x + 2 + C"],
    correctAnswer: 0,
    userAnswer: null,
    flagged: false,
  },
  {
    id: 2,
    question: "Find the derivative of f(x) = e^(2x) · sin(x)",
    options: [
      "2e^(2x) · sin(x) + e^(2x) · cos(x)",
      "e^(2x) · cos(x)",
      "2e^(2x) · cos(x)",
      "e^(2x) · (2sin(x) + cos(x))",
    ],
    correctAnswer: 0,
    userAnswer: null,
    flagged: false,
  },
  {
    id: 3,
    question: "What is the limit: lim(x→∞) (3x² + 2x) / (x² - 1)?",
    options: ["0", "3", "∞", "Does not exist"],
    correctAnswer: 1,
    userAnswer: null,
    flagged: false,
  },
  {
    id: 4,
    question: "A ball is thrown upward with initial velocity of 20 m/s. How long until it reaches maximum height? (g = 10 m/s²)",
    options: ["1 second", "2 seconds", "3 seconds", "4 seconds"],
    correctAnswer: 1,
    userAnswer: null,
    flagged: false,
  },
  {
    id: 5,
    question: "Solve for x: log₂(x + 3) = 4",
    options: ["x = 13", "x = 16", "x = 11", "x = 8"],
    correctAnswer: 0,
    userAnswer: null,
    flagged: false,
  },
  {
    id: 6,
    question: "Which of the following is a solution to the differential equation dy/dx = 2y?",
    options: ["y = e^(2x)", "y = Ce^(2x)", "y = 2e^x", "y = x²"],
    correctAnswer: 1,
    userAnswer: null,
    flagged: false,
  },
  {
    id: 7,
    question: "Find the area under the curve y = x² from x = 0 to x = 2",
    options: ["8/3", "4", "2/3", "8"],
    correctAnswer: 0,
    userAnswer: null,
    flagged: false,
  },
  {
    id: 8,
    question: "What is the domain of f(x) = √(4 - x²)?",
    options: ["[-2, 2]", "[0, 2]", "(-∞, ∞)", "[-4, 4]"],
    correctAnswer: 0,
    userAnswer: null,
    flagged: false,
  },
];

export function ExamMode() {
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [questions, setQuestions] = useState(mockExamQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, userAnswer: answerIndex } : q
      )
    );
  };

  const handleFlagQuestion = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, flagged: !q.flagged } : q))
    );
  };

  const handleSubmit = () => {
    setExamCompleted(true);
  };

  const answeredCount = questions.filter((q) => q.userAnswer !== null).length;
  const flaggedCount = questions.filter((q) => q.flagged).length;

  if (!examStarted) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1C1F2A] mb-2">Exam Mode</h1>
          <p className="text-[#6B7280] mb-8">
            Simulate a real exam experience with timed tests
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1C1F2A] mb-6">
              Calculus Midterm Practice Exam
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-[#EEF3FB] rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#4A90E2] rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Duration</p>
                    <p className="font-bold text-[#1C1F2A]">60 minutes</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#EEF3FB] rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#7C5CFF] rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Questions</p>
                    <p className="font-bold text-[#1C1F2A]">8 questions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FEF3F2] border border-[#EF4444]/20 rounded-xl p-4 mb-8">
              <h3 className="font-semibold text-[#EF4444] mb-2">Exam Rules</h3>
              <ul className="text-sm text-[#1C1F2A] space-y-1">
                <li>• Once started, the timer cannot be paused</li>
                <li>• You can flag questions for review</li>
                <li>• Navigate between questions anytime</li>
                <li>• Submit only when you're ready - you can review after</li>
              </ul>
            </div>

            <button
              onClick={() => setExamStarted(true)}
              className="w-full py-4 bg-gradient-to-r from-[#4A90E2] to-[#7C5CFF] text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (examCompleted) {
    const correctCount = questions.filter(
      (q) => q.userAnswer === q.correctAnswer
    ).length;
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-6">
            <div
              className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                score >= 70
                  ? "bg-[#22C55E]/10"
                  : score >= 50
                  ? "bg-[#F59E0B]/10"
                  : "bg-[#EF4444]/10"
              }`}
            >
              <span className="text-4xl font-bold">{score}%</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1C1F2A] mb-2">
              Exam Complete!
            </h1>
            <p className="text-[#6B7280]">
              You scored {correctCount} out of {questions.length}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-[#4A90E2]">{answeredCount}</p>
              <p className="text-sm text-[#6B7280]">Questions Answered</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-[#22C55E]">{correctCount}</p>
              <p className="text-sm text-[#6B7280]">Correct Answers</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-[#F59E0B]">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </p>
              <p className="text-sm text-[#6B7280]">Time Remaining</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setExamStarted(false);
                setExamCompleted(false);
                setQuestions(mockExamQuestions);
                setCurrentQuestion(0);
              }}
              className="flex-1 py-3 bg-white border-2 border-[#4A90E2] text-[#4A90E2] rounded-xl hover:bg-[#EEF3FB] transition-all"
            >
              Try Another Exam
            </button>
            <button className="flex-1 py-3 bg-gradient-to-r from-[#4A90E2] to-[#7C5CFF] text-white rounded-xl hover:shadow-lg transition-all">
              Review Answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Question Navigation Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="font-bold text-[#1C1F2A] mb-2">Questions</h3>
          <p className="text-xs text-[#6B7280]">
            {answeredCount} of {questions.length} answered
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              className={`relative aspect-square rounded-lg border-2 transition-all ${
                currentQuestion === index
                  ? "border-[#4A90E2] bg-[#4A90E2] text-white"
                  : q.userAnswer !== null
                  ? "border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]"
                  : "border-gray-300 hover:border-[#4A90E2]"
              }`}
            >
              <span className="text-sm font-semibold">{index + 1}</span>
              {q.flagged && (
                <Flag className="absolute top-0.5 right-0.5 w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
              )}
            </button>
          ))}
        </div>

        {flaggedCount > 0 && (
          <div className="mt-4 p-3 bg-[#FEF3F2] border border-[#F59E0B]/20 rounded-lg">
            <p className="text-xs text-[#F59E0B] font-medium">
              {flaggedCount} question{flaggedCount > 1 ? "s" : ""} flagged for review
            </p>
          </div>
        )}
      </div>

      {/* Main Exam Area */}
      <div className="flex-1 flex flex-col">
        {/* Timer Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#1C1F2A]">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <p className="text-sm text-[#6B7280]">Calculus Midterm Practice</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#EEF3FB] rounded-lg">
            <Clock className="w-5 h-5 text-[#4A90E2]" />
            <span className="font-bold text-[#4A90E2]">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#1C1F2A] flex-1">
                  {questions[currentQuestion].question}
                </h3>
                <button
                  onClick={() => handleFlagQuestion(questions[currentQuestion].id)}
                  className={`ml-4 p-2 rounded-lg transition-all ${
                    questions[currentQuestion].flagged
                      ? "bg-[#F59E0B] text-white"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleAnswerSelect(questions[currentQuestion].id, index)
                    }
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      questions[currentQuestion].userAnswer === index
                        ? "border-[#4A90E2] bg-[#4A90E2]/5"
                        : "border-gray-200 hover:border-[#4A90E2]/50 hover:bg-[#EEF3FB]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          questions[currentQuestion].userAnswer === index
                            ? "border-[#4A90E2] bg-[#4A90E2]"
                            : "border-gray-300"
                        }`}
                      >
                        {questions[currentQuestion].userAnswer === index && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-medium text-[#1C1F2A]">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#2ED3B7] text-white rounded-xl hover:shadow-lg transition-all"
              >
                Submit Exam
              </button>

              <button
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
                disabled={currentQuestion === questions.length - 1}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
