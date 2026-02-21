import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, Check, CheckCheck, Image, X } from 'lucide-react';
import API from '../api';

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(location.state?.userId || null);
  const [selectedName, setSelectedName] = useState(location.state?.userName || '');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const fileInputRef = useRef(null);
  const role = localStorage.getItem('role');

  // Sohbet listesini yükle
  useEffect(() => {
    loadConversations();
  }, []);

  // Seçili kullanıcı değişince mesajları yükle
  useEffect(() => {
    if (selectedUser) {
      loadMessages();
      // 3 saniyede bir yeni mesaj kontrolü
      pollRef.current = setInterval(loadMessages, 3000);
      return () => clearInterval(pollRef.current);
    }
  }, [selectedUser]);

  // Mesaj gelince aşağı kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await API.get('/api/chat/conversations/');
      setConversations(res.data);

      // Öğrenci ise ve tek koç varsa otomatik seç
      if (role === 'student' && res.data.length === 1 && !selectedUser) {
        setSelectedUser(res.data[0].user_id);
        setSelectedName(res.data[0].name);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedUser) return;
    try {
      const res = await API.get(`/api/chat/messages/${selectedUser}/`);
      setMessages(res.data);
      // Sohbet listesini de güncelle (okunmamış badge)
      loadConversations();
    } catch (err) {
    }
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedImage) || !selectedUser) return;

    try {
      if (selectedImage) {
        const formData = new FormData();
        formData.append('receiver_id', selectedUser);
        formData.append('message', newMessage.trim());
        formData.append('image', selectedImage);
        await API.post('/api/chat/send/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await API.post('/api/chat/send/', {
          receiver_id: selectedUser,
          message: newMessage.trim()
        });
      }
      setNewMessage('');
      clearImage();
      loadMessages();
    } catch (err) {
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Fotoğraf en fazla 5MB olabilir');
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Mesajları tarihe göre grupla
  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(m => {
      if (!groups[m.date]) groups[m.date] = [];
      groups[m.date].push(m);
    });
    return groups;
  };

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 max-w-[100vw] overflow-hidden">
      {/* Sol: Sohbet Listesi */}
      <div className={`${selectedUser ? 'hidden md:flex' : 'flex'}
        flex-col w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0`}>

        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-amber-500">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <MessageCircle className="text-white" size={22} />
            <h2 className="text-lg font-semibold text-white">Mesajlar</h2>
          </div>
        </div>

        {/* Sohbet Listesi */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <MessageCircle size={40} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Henüz sohbet yok</p>
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.user_id}
                onClick={() => {
                  setSelectedUser(conv.user_id);
                  setSelectedName(conv.name);
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100
                  hover:bg-orange-50/50 transition-colors
                  ${selectedUser === conv.user_id ? 'bg-orange-50' : ''}`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-orange-100
                  flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
                  {conv.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 text-sm">{conv.name}</span>
                    <span className="text-xs text-gray-400">{conv.last_message_time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-500 truncate">
                      {conv.is_mine && <span className="text-gray-400">Sen: </span>}
                      {conv.last_message}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5
                        flex items-center justify-center flex-shrink-0 ml-2">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sağ: Mesaj Alanı */}
      <div className={`${!selectedUser ? 'hidden md:flex' : 'flex'} flex-col flex-1 min-w-0`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
              <button
                onClick={() => { setSelectedUser(null); setMessages([]); }}
                className="md:hidden text-white/80 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-9 h-9 rounded-full bg-white/20
                flex items-center justify-center text-white font-bold text-sm">
                {selectedName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{selectedName}</h3>
              </div>
            </div>

            {/* Mesajlar */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-[#f5f0eb]"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4a574\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>

              {Object.entries(grouped).map(([date, msgs]) => (
                <div key={date}>
                  {/* Tarih ayırıcı */}
                  <div className="flex items-center justify-center my-3">
                    <span className="px-3 py-1 bg-white/90 text-gray-600 text-[11px] rounded-lg shadow-sm font-medium">
                      {date}
                    </span>
                  </div>

                  {msgs.map(msg => (
                    <div key={msg.id} className={`flex mb-1.5 ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`relative max-w-[75%] px-3 py-2 shadow-sm
                        ${msg.is_mine
                          ? 'bg-orange-50 text-gray-800 rounded-xl rounded-tr-sm border border-orange-100'
                          : 'bg-white text-gray-800 rounded-xl rounded-tl-sm'}`}>
                        {/* Gönderen ismi (karşı taraf için) */}
                        {!msg.is_mine && msg.sender_name && (
                          <p className="text-xs font-semibold text-orange-600 mb-0.5">{msg.sender_name}</p>
                        )}
                        {/* Fotoğraf */}
                        {msg.image_url && (
                          <img
                            src={msg.image_url}
                            alt=""
                            className="rounded-lg max-w-full max-h-60 object-cover cursor-pointer mb-1"
                            onClick={() => setLightboxUrl(msg.image_url)}
                          />
                        )}
                        {msg.message && (
                          <p className="text-[13px] whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                        )}
                        <div className="flex items-center justify-end gap-1 -mb-0.5 mt-0.5">
                          <span className="text-[10px] text-gray-400">{msg.time}</span>
                          {msg.is_mine && (
                            msg.is_read
                              ? <CheckCheck size={14} className="text-orange-500" />
                              : <Check size={14} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Fotoğraf Önizleme */}
            {imagePreview && (
              <div className="px-3 pt-2 bg-gray-100 border-t border-gray-200">
                <div className="relative inline-block">
                  <img src={imagePreview} alt="" className="h-20 rounded-lg object-cover" />
                  <button
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full
                      flex items-center justify-center shadow-md hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Mesaj Gönder */}
            <div className={`p-2 bg-gray-100 ${!imagePreview ? 'border-t border-gray-200' : ''}`}>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 text-gray-500 hover:text-orange-500 flex items-center justify-center
                    transition-colors flex-shrink-0"
                >
                  <Image size={22} />
                </button>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Mesaj yaz..."
                  rows={1}
                  className="flex-1 px-4 py-2.5 bg-white border-0 rounded-full text-sm
                    focus:outline-none resize-none shadow-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() && !selectedImage}
                  className="w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300
                    text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Sohbet seçilmemiş */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircle size={64} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">Bir sohbet seçin</p>
            <p className="text-sm mt-1">Sol taraftan bir kişi seçerek mesajlaşmaya başlayın</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full
              flex items-center justify-center text-white transition-colors"
            onClick={() => setLightboxUrl(null)}
          >
            <X size={24} />
          </button>
          <img
            src={lightboxUrl}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
