import { useEffect, useState, useRef } from 'react';
import { MessageCircle, FileText, ClipboardList, Check, CheckCheck, Send, User } from 'lucide-react';
import API from '../api';

const TABS = [
  { key: 'messages', label: 'Mesajlar', icon: MessageCircle },
  { key: 'notes', label: 'Koç Notları', icon: FileText },
  { key: 'assignments', label: 'Ödevlerim', icon: ClipboardList },
];

export default function StudentCoach() {
  const [activeTab, setActiveTab] = useState('messages');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800">Koçum</h1>

        {/* Tab Bar */}
        <div className="flex bg-white rounded-xl border border-gray-100 p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'notes' && <CoachNotesTab />}
        {activeTab === 'assignments' && <AssignmentsTab />}
      </div>
    </div>
  );
}

// ==================== MESAJLAR TAB ====================
function MessagesTab() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Mesaj gelince aşağı kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Polling: 3 saniyede bir mesaj kontrolü
  useEffect(() => {
    if (selectedUserId) {
      pollRef.current = setInterval(() => selectConversation(selectedUserId), 3000);
      return () => clearInterval(pollRef.current);
    }
  }, [selectedUserId]);

  const fetchConversations = async () => {
    try {
      const res = await API.get('/api/chat/conversations/');
      const convos = res.data || [];
      setConversations(convos);
      if (convos.length > 0 && !selectedUserId) {
        setSelectedName(convos[0].name);
        selectConversation(convos[0].user_id);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (userId) => {
    setSelectedUserId(userId);
    try {
      const res = await API.get(`/api/chat/messages/${userId}/`);
      setMessages(res.data || []);
    } catch (err) {}
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    setSending(true);
    try {
      await API.post('/api/chat/send/', {
        receiver_id: selectedUserId,
        message: newMessage.trim(),
      });
      setNewMessage('');
      selectConversation(selectedUserId);
    } catch (err) {
      alert('Mesaj gönderilemedi');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-400">Yükleniyor...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Henüz mesaj yok</p>
        <p className="text-sm text-gray-400 mt-1">Koçunla bağlandıktan sonra mesajlaşabilirsin.</p>
      </div>
    );
  }

  // Mesajları tarihe göre grupla
  const grouped = {};
  messages.forEach(m => {
    const date = m.date || '';
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(m);
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100">
      {/* Koç header */}
      {selectedName && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#075e54] text-white">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
            {selectedName.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-sm">{selectedName}</span>
        </div>
      )}

      {/* Mesaj listesi */}
      <div className="h-[400px] overflow-y-auto p-3 space-y-1 bg-[#efeae2]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c9b99a\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">Henüz mesaj yok. Bir mesaj gönder!</p>
        ) : (
          Object.entries(grouped).map(([date, msgs]) => (
            <div key={date}>
              {date && (
                <div className="flex items-center justify-center my-3">
                  <span className="px-3 py-1 bg-white/80 text-gray-600 text-[11px] rounded-lg shadow-sm font-medium">
                    {date}
                  </span>
                </div>
              )}
              {msgs.map((msg) => (
                <div key={msg.id} className={`flex mb-1.5 ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-[80%] px-3 py-2 shadow-sm
                    ${msg.is_mine
                      ? 'bg-[#d9fdd3] text-gray-800 rounded-xl rounded-tr-sm'
                      : 'bg-white text-gray-800 rounded-xl rounded-tl-sm'}`}>
                    {/* Gönderen ismi (koç mesajı) */}
                    {!msg.is_mine && msg.sender_name && (
                      <p className="text-xs font-semibold text-orange-600 mb-0.5">{msg.sender_name}</p>
                    )}
                    <p className="text-[13px] whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                    <div className="flex items-center justify-end gap-1 -mb-0.5 mt-0.5">
                      <span className="text-[10px] text-gray-500">{msg.time}</span>
                      {msg.is_mine && (
                        msg.is_read
                          ? <CheckCheck size={14} className="text-blue-500" />
                          : <Check size={14} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mesaj gönderme */}
      <div className="p-2 bg-[#f0f0f0] flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Mesaj yaz..."
          className="flex-1 px-4 py-2.5 bg-white rounded-full text-sm focus:outline-none shadow-sm"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className="w-10 h-10 bg-[#075e54] hover:bg-[#064e46] disabled:bg-gray-300
            text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// ==================== KOÇ NOTLARI TAB ====================
function CoachNotesTab() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/api/student/coach-notes/');
      setNotes(res.data?.notes || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-400">Yükleniyor...</div>;
  }

  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <FileText size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Henüz koç notu yok</p>
        <p className="text-sm text-gray-400 mt-1">Koçun haftalık notlarını buradan görebilirsin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div key={note.id} className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <User size={16} className="text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Koçunun notu</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(note.week_start).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} haftası
            </span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{note.content}</p>
        </div>
      ))}
    </div>
  );
}

// ==================== ÖDEVLERİM TAB ====================
function AssignmentsTab() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await API.get('/api/assignments/');
      setAssignments(res.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (assignmentId) => {
    setCompletingId(assignmentId);
    try {
      await API.post(`/api/assignments/${assignmentId}/complete/`);
      fetchAssignments();
    } catch (err) {
      alert('Ödev tamamlanamadı');
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-400">Yükleniyor...</div>;
  }

  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Henüz ödev yok</p>
        <p className="text-sm text-gray-400 mt-1">Koçun sana ödev verdiğinde burada görünecek.</p>
      </div>
    );
  }

  const pending = assignments.filter((a) => a.status === 'pending');
  const completed = assignments.filter((a) => a.status === 'completed');

  return (
    <div className="space-y-4">
      {/* Bekleyen Ödevler */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bekleyen ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{a.title}</h4>
                    {a.description && <p className="text-sm text-gray-500 mt-1">{a.description}</p>}
                    <p className="text-xs text-gray-400 mt-2">
                      Son tarih: {new Date(a.due_date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleComplete(a.id)}
                    disabled={completingId === a.id}
                    className="ml-3 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
                  >
                    <Check size={14} />
                    {completingId === a.id ? '...' : 'Tamamla'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tamamlanan Ödevler */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Tamamlanan ({completed.length})</h3>
          <div className="space-y-2">
            {completed.slice(0, 5).map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check size={14} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 line-through truncate">{a.title}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {a.completed_at ? new Date(a.completed_at).toLocaleDateString('tr-TR') : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
