
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

export function ApiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const newMessages = [...messages, { sender: 'user' as 'user', text: inputValue }];
    setMessages(newMessages);
    setInputValue('');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-4 w-full max-w-sm bg-card border-t border-l border-r rounded-t-lg shadow-2xl"
          >
            <header className="flex items-center justify-between p-4 border-b cursor-pointer" onClick={toggleOpen}>
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                <h3 className="font-semibold">API Learning Assistant</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </header>
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {/* Initial message */}
                <div className="flex gap-2 items-start">
                    <div className="bg-primary text-primary-foreground p-2 rounded-full">
                        <Bot className="w-5 h-5"/>
                    </div>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                        <p className="text-sm">Welcome! Ask me anything about APIs.</p>
                    </div>
                </div>

                {/* Messages will be rendered here */}

              </div>
            </ScrollArea>
            <footer className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className="fixed bottom-4 right-4 rounded-full h-16 w-16 shadow-lg"
            onClick={toggleOpen}
          >
            <Bot className="w-8 h-8" />
          </Button>
        </motion.div>
      )}
    </>
  );
}
