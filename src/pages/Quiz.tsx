import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/hooks/useQuiz";
import { checkers } from "@/data/checkers";

export default function Quiz() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const checkerId = params.checkerId as string;
  const checker = checkers.find(c => c.id === checkerId);

  const {
    questions,
    currentQuestionIndex,
    currentQuestion,
    answers,
    selectAnswer,
    nextQuestion,
    isLoaded,
    calculateScore,
  } = useQuiz(checkerId);

  if (!checker) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center text-white">
        Checker not found
      </div>
    );
  }

  if (!isLoaded || !currentQuestion) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-black">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
          <p className="text-gray-500 font-medium">Preparing the lab...</p>
        </div>
      </div>
    );
  }

  const selectedWeight = answers[currentQuestionIndex];
  const progress = (currentQuestionIndex / 10) * 100;

  return (
    <div className="min-h-[100dvh] w-full bg-black text-white flex flex-col font-sans">
      {/* Top Bar */}
      <header className="pt-6 pb-4 px-6 md:px-12 flex justify-between items-center z-10 sticky top-0 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-gray-300 font-medium">
          <span className="text-xl">{checker.emoji}</span>
          <span>{checker.title}</span>
        </div>
        <div className="text-gray-400 font-semibold font-mono">
          {currentQuestionIndex + 1} / 10
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full px-6 md:px-12 mb-8">
        <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 md:px-6 w-full max-w-3xl mx-auto pb-24 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex flex-col gap-6"
          >
            {/* Question Card */}
            <div className="bg-[#111111] rounded-[24px] p-8 md:p-10 shadow-lg border border-[#1a1a1a]">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="flex flex-col gap-3">
              {currentQuestion.shuffledOptions.map((option, idx) => {
                const isSelected = selectedWeight === option.weight;

                return (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(option.weight)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border relative overflow-hidden group ${
                      isSelected
                        ? "bg-[rgba(139,92,246,0.15)] border-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                        : "bg-[#1a1a1a] border-[#252525] hover:border-[#3a3a3a] hover:bg-[#202020]"
                    }`}
                  >
                    <span className="relative z-10 text-lg md:text-xl font-medium text-gray-100">
                      {option.text}
                    </span>

                    {isSelected && (
                      <motion.div
                        layoutId="selected-outline"
                        className="absolute inset-0 border-2 border-purple-500 rounded-2xl pointer-events-none"
                        initial={false}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-end max-w-3xl mx-auto right-0 z-20">
        <button
          onClick={() => {
            if (currentQuestionIndex === questions.length - 1) {
              const score = calculateScore();
              setLocation(`/result/${checkerId}/${score}`);
            } else {
              nextQuestion();
            }
          }}
          disabled={selectedWeight === undefined}
          className={`px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform ${
            selectedWeight !== undefined
              ? "bg-white text-black translate-y-0 opacity-100 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              : "bg-gray-800 text-gray-500 translate-y-2 opacity-50 cursor-not-allowed"
          }`}
        >
          {currentQuestionIndex === questions.length - 1
            ? "Show Result"
            : "Next"}
        </button>
      </div>
    </div>
  );
}