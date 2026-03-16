import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { aiSupportApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Send, Sparkles } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const AISupportChatPage = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'مرحباً بك، أنا خدماتي AI. اكتب استفسارك عن الحساب، الطلبات، الخدمات، الدفع، المحفظة أو أي مشكلة وسأساعدك خطوة بخطوة.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const history = nextMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await aiSupportApi.chat({
        message: text,
        history,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.reply || 'عذراً، لم أتمكن من تكوين رد الآن.' },
      ]);
    } catch {
      toast({
        title: 'تعذر الوصول إلى خدماتي AI',
        description: 'تحقق من إعداد GROQ_API_KEY في الباك إند ثم حاول مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bot size={24} className="text-primary" />
            خدماتي AI
          </h1>
          <p className="text-muted-foreground mt-1">محادثة دعم فني آلية للإجابة على استفساراتك داخل منصة خدماتي</p>
        </div>

        <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              محادثة الدعم الفني الذكي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/20 p-3 h-[440px] overflow-y-auto space-y-3">
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                        isUser
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-card border border-border text-foreground rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-card border border-border text-foreground rounded-bl-sm inline-flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    جاري التفكير...
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="اكتب سؤالك هنا..."
                className="min-h-[90px]"
              />
              <div className="flex justify-end">
                <Button onClick={sendMessage} disabled={loading || !input.trim()} className="gap-2">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  إرسال
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AISupportChatPage;
