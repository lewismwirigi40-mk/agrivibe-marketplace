import AdminLayout from '../../components/AdminLayout';
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function UnansweredQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/ai/unanswered');
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (id: string) => {
    if (!answerText.trim()) return;
    
    try {
      await api.put(`/ai/unanswered/${id}`, { answer: answerText });
      setAnswering(null);
      setAnswerText('');
      fetchQuestions();
    } catch (error) {
      console.error('Failed to answer question:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">❓ Unanswered Questions</h1>
          <p className="text-gray-400 mt-1">Review and answer customer questions</p>
        </div>
        <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-xl px-4 py-2">
          <span className="text-yellow-400 font-semibold">{questions.length} Pending</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 mt-8">Loading...</div>
      ) : questions.length === 0 ? (
        <div className="text-center mt-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-white">All questions answered!</h3>
          <p className="text-gray-400 mt-2">Great job! No pending questions.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {questions.map((q: any) => (
            <div key={q.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-white font-medium">❓ {q.question}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Asked: {new Date(q.asked_at).toLocaleString()}
                  </p>
                </div>
                <span className="bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full">
                  Pending
                </span>
              </div>

              {answering === q.id ? (
                <div className="mt-4 space-y-3">
                  <textarea
                    placeholder="Type your answer here..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAnswer(q.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold transition"
                    >
                      Submit Answer
                    </button>
                    <button
                      onClick={() => {
                        setAnswering(null);
                        setAnswerText('');
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAnswering(q.id)}
                  className="mt-3 text-yellow-400 hover:text-yellow-300 text-sm transition"
                >
                  ✏️ Answer Question
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}