
import { Startup, Message } from '../types';
import { MOCK_STARTUPS, MOCK_PORTFOLIO, MOCK_MESSAGES } from '../constants';

const KEYS = {
  STARTUPS: 'vf_startups',
  PORTFOLIO: 'vf_portfolio',
  MESSAGES: 'vf_messages'
};

export const db = {
  init: () => {
    if (!localStorage.getItem(KEYS.STARTUPS)) {
      localStorage.setItem(KEYS.STARTUPS, JSON.stringify(MOCK_STARTUPS));
    }
    if (!localStorage.getItem(KEYS.PORTFOLIO)) {
      localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(MOCK_PORTFOLIO));
    }
    if (!localStorage.getItem(KEYS.MESSAGES)) {
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(MOCK_MESSAGES));
    }
  },

  getStartups: (): Startup[] => JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]'),
  
  getPortfolio: (): Startup[] => JSON.parse(localStorage.getItem(KEYS.PORTFOLIO) || '[]'),
  
  getMessages: (): Message[] => JSON.parse(localStorage.getItem(KEYS.MESSAGES) || '[]'),

  addMessage: (msg: Message) => {
    const msgs = db.getMessages();
    msgs.push(msg);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(msgs));
    return msgs;
  },

  updateStartup: (updated: Startup) => {
    const startups = db.getStartups();
    const index = startups.findIndex(s => s.id === updated.id);
    if (index !== -1) {
      startups[index] = updated;
      localStorage.setItem(KEYS.STARTUPS, JSON.stringify(startups));
    }
  }
};
