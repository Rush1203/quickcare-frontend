import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import ChatMessage from '../../components/ai/ChatMessage';
import TypingIndicator from '../../components/ai/TypingIndicator';
import DisclaimerBanner from '../../components/ai/DisclaimerBanner';
import { Send, Sparkles } from '../../components/ui/icons';
import { aiApi } from '../../api/ai';
import { getErrorMessage } from '../../api/axios';

const SUGGESTIONS = [
  'What are common symptoms of dehydration?',
  'How much sleep do adults need?',
  'What foods help lower blood pressure?',
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const res = await aiApi.chat(trimmed);
      setMessages((m) => [...m, { role: 'assistant', content: res.data.answer }]);
    } catch (err) {
      const errMsg = getErrorMessage(err);
      setMessages((m) => [...m, { role: 'assistant', content: errMsg, isError: true }]);
      toast.error('The assistant could not respond');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Patient Dashboard"
        title="AI Medical Assistant"
        subtitle="Ask general health questions and get informational guidance."
      />

      <div className="mb-4">
        <DisclaimerBanner />
      </div>

      <div className="card flex flex-col h-[60vh] min-h-[420px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-4">
                <Sparkles size={22} />
              </span>
              <h3 className="font-serif text-lg font-semibold text-ink mb-1.5">
                Ask the assistant anything
              </h3>
              <p className="text-sm text-ink/55 max-w-sm mb-5">
                Get general health information, explanations of medical terms, and wellness guidance.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-pine-200 bg-mint/60 px-3.5 py-1.5 text-xs font-medium text-pine-700 hover:bg-mint transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} isError={msg.isError} />
              ))}
              {isSending && <TypingIndicator />}
            </>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-pine-100 px-4 sm:px-5 py-3.5 flex items-center gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a health question…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink/35 px-1"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine-600 text-white transition-colors hover:bg-pine-700 disabled:opacity-40 disabled:hover:bg-pine-600"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
