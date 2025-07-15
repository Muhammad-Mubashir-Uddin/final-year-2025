import React, { useState, useRef, useEffect } from 'react';
import styles from './chatbot.module.css';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Ask me about dishes, prices, or restaurants. 😊' },
  ]);
  const [loading, setLoading] = useState(false);
  const [pendingBotMsg, setPendingBotMsg] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Animate bot reply word-by-word
  useEffect(() => {
    if (pendingBotMsg) {
      let i = 0;
      let words = pendingBotMsg.split(' ');
      let current = '';
      const interval = setInterval(() => {
        if (i < words.length) {
          current += (i === 0 ? '' : ' ') + words[i];
          setMessages((msgs) => {
            const last = msgs[msgs.length - 1];
            if (last && last.sender === 'bot' && last.animated) {
              return [...msgs.slice(0, -1), { ...last, text: current }];
            } else {
              return [...msgs, { sender: 'bot', text: current, animated: true }];
            }
          });
          i++;
        } else {
          setPendingBotMsg(null);
          clearInterval(interval);
        }
      }, 40); // 40ms per word
      return () => clearInterval(interval);
    }
  }, [pendingBotMsg]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chatbot/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await res.json();
      setPendingBotMsg(data.reply);
    } catch (err) {
      setPendingBotMsg('Sorry, something went wrong.');
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      <button className={styles.fab} onClick={() => setOpen((o) => !o)} aria-label="Open chatbot">
        <FaRobot size={28} />
      </button>
      {open && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <FaRobot size={20} style={{ marginRight: 8 }} />
            <span>Ask FoodieBot</span>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === 'user' ? styles.userMsg : styles.botMsg}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.inputRow}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.input}
              autoFocus
            />
            <button className={styles.sendBtn} onClick={sendMessage} disabled={loading || !input.trim()}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget; 