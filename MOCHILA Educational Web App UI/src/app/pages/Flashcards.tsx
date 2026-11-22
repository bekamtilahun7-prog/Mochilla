import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Check, X } from "lucide-react";

const flashcardSets = [
  { id: 1, title: "Calculus Derivatives", cards: 24, mastered: 18 },
  { id: 2, title: "Organic Chemistry", cards: 32, mastered: 12 },
  { id: 3, title: "World History", cards: 28, mastered: 20 },
];

const mockFlashcards = [
  {
    id: 1,
    front: "What is the derivative of sin(x)?",
    back: "cos(x)",
    mastered: false,
  },
  {
    id: 2,
    front: "State the Pythagorean Theorem",
    back: "a² + b² = c², where c is the hypotenuse of a right triangle",
    mastered: false,
  },
  {
    id: 3,
    front: "What is the chain rule for derivatives?",
    back: "d/dx[f(g(x))] = f'(g(x)) · g'(x)",
    mastered: false,
  },
  {
    id: 4,
    front: "Define a continuous function",
    back: "A function f is continuous at point a if lim(x→a) f(x) = f(a)",
    mastered: false,
  },
];

export function Flashcards() {
  const [selectedSet, setSelectedSet] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(mockFlashcards);

  const handleMarkMastered = (mastered: boolean) => {
    setCards((prev) =>
      prev.map((card, index) =>
        index === currentCardIndex ? { ...card, mastered } : card
      )
    );
    handleNext();
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCards((prev) => prev.map((card) => ({ ...card, mastered: false })));
  };

  if (!selectedSet) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-[#1C1F2A] mb-2">Flashcards</h1>
        <p className="text-[#6B7280] mb-8">
          Select a flashcard set to start reviewing
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcardSets.map((set) => (
            <div
              key={set.id}
              onClick={() => setSelectedSet(set.id)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#4A90E2] transition-all cursor-pointer"
            >
              <h3 className="text-xl font-bold text-[#1C1F2A] mb-3">
                {set.title}
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-[#6B7280]">{set.cards} cards</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2ED3B7] to-[#22C55E]"
                      style={{ width: `${(set.mastered / set.cards) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-[#6B7280]">
                    {set.mastered}/{set.cards}
                  </span>
                </div>
                <p className="text-xs text-[#22C55E] font-medium">
                  {Math.round((set.mastered / set.cards) * 100)}% mastered
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#7C5CFF] to-[#9D7FFF] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">How to use flashcards effectively</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Read the question</h3>
                <p className="text-sm text-white/80">
                  Take your time to understand what's being asked
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Flip to see answer</h3>
                <p className="text-sm text-white/80">
                  Try to recall the answer before flipping
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Mark your progress</h3>
                <p className="text-sm text-white/80">
                  Indicate if you've mastered it or need review
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const masteredCount = cards.filter((c) => c.mastered).length;
  const currentCard = cards[currentCardIndex];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => setSelectedSet(null)}
              className="text-[#4A90E2] hover:text-[#7C5CFF] mb-2 text-sm"
            >
              ← Back to sets
            </button>
            <h1 className="text-3xl font-bold text-[#1C1F2A]">
              {flashcardSets.find((s) => s.id === selectedSet)?.title}
            </h1>
            <p className="text-[#6B7280] mt-1">
              Card {currentCardIndex + 1} of {cards.length}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6B7280]">Progress</span>
            <span className="text-sm font-medium text-[#22C55E]">
              {masteredCount} mastered
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2ED3B7] to-[#22C55E] transition-all"
              style={{ width: `${(masteredCount / cards.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative mb-8" style={{ perspective: "1000px" }}>
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative cursor-pointer transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              height: "400px",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#4A90E2] to-[#7C5CFF] rounded-2xl p-12 flex items-center justify-center shadow-xl"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              <div className="text-center text-white">
                <p className="text-sm uppercase tracking-wider mb-4 text-white/80">
                  Question
                </p>
                <h2 className="text-2xl font-semibold leading-relaxed">
                  {currentCard.front}
                </h2>
                <p className="text-sm text-white/70 mt-6">Click to flip</p>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 bg-white border-2 border-[#4A90E2] rounded-2xl p-12 flex items-center justify-center shadow-xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="text-center">
                <p className="text-sm uppercase tracking-wider mb-4 text-[#7C5CFF] font-semibold">
                  Answer
                </p>
                <h2 className="text-2xl font-semibold text-[#1C1F2A] leading-relaxed">
                  {currentCard.back}
                </h2>
                <p className="text-sm text-[#6B7280] mt-6">Click to flip back</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => handleMarkMastered(false)}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#EF4444] text-[#EF4444] rounded-xl hover:bg-[#EF4444]/5 transition-all"
            >
              <X className="w-5 h-5" />
              Need Review
            </button>
            <button
              onClick={() => handleMarkMastered(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#2ED3B7] text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Check className="w-5 h-5" />
              Mastered
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentCardIndex === cards.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
