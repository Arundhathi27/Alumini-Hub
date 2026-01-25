import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        if (this.socket?.connected) {
            return;
        }

        this.socket = io('http://localhost:5000', {
            auth: {
                token: token
            }
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinConversation(conversationId) {
        if (this.socket) {
            this.socket.emit('joinConversation', conversationId);
        }
    }

    leaveConversation(conversationId) {
        if (this.socket) {
            this.socket.emit('leaveConversation', conversationId);
        }
    }

    sendMessage(conversationId, messageText) {
        if (this.socket) {
            this.socket.emit('sendMessage', { conversationId, messageText });
        }
    }

    onMessageReceived(callback) {
        if (this.socket) {
            this.socket.on('receiveMessage', callback);
        }
    }

    offMessageReceived() {
        if (this.socket) {
            this.socket.off('receiveMessage');
        }
    }

    markMessageRead(messageId) {
        if (this.socket) {
            this.socket.emit('messageRead', messageId);
        }
    }

    onMessageReadStatus(callback) {
        if (this.socket) {
            this.socket.on('messageReadStatus', callback);
        }
    }

    setTyping(conversationId) {
        if (this.socket) {
            this.socket.emit('typing', conversationId);
        }
    }

    setStopTyping(conversationId) {
        if (this.socket) {
            this.socket.emit('stopTyping', conversationId);
        }
    }

    onUserTyping(callback) {
        if (this.socket) {
            this.socket.on('userTyping', callback);
        }
    }

    onUserStoppedTyping(callback) {
        if (this.socket) {
            this.socket.on('userStoppedTyping', callback);
        }
    }
}

export default new SocketService();
