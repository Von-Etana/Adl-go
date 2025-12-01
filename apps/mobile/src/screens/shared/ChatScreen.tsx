import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Send, Image as ImageIcon, ArrowLeft } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../theme/tokens';
import { useChatStore, Message } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { AnimatedIcon } from '../../components/atoms/AnimatedIcon';

export const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { chatRoomId, recipientName } = route.params;
    const { user } = useAuthStore();
    const {
        messages,
        sendMessage,
        setActiveChatRoom,
        setTyping,
        typingUsers,
    } = useChatStore();

    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const roomMessages = messages[chatRoomId] || [];
    const isRecipientTyping = Object.entries(typingUsers).some(
        ([id, isTyping]) => id !== user?.id && isTyping
    );

    useEffect(() => {
        setActiveChatRoom(chatRoomId);
        return () => setActiveChatRoom(null);
    }, [chatRoomId]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        sendMessage(chatRoomId, inputText.trim());
        setInputText('');
    };

    const handleTyping = (text: string) => {
        setInputText(text);
        setTyping(chatRoomId, text.length > 0);
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.senderId === user?.id;

        return (
            <View
                style={[
                    styles.messageContainer,
                    isMe ? styles.myMessage : styles.theirMessage,
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        isMe ? styles.myMessageText : styles.theirMessageText,
                    ]}
                >
                    {item.content}
                </Text>
                <Text style={styles.timestamp}>
                    {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeft size={24} color={colors.primary.dark} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{recipientName || 'Chat'}</Text>
                    {isRecipientTyping && (
                        <Text style={styles.typingIndicator}>Typing...</Text>
                    )}
                </View>
            </View>

            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={roomMessages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                inverted={false} // Assuming messages are ordered oldest to newest, we might want to invert if we receive them newest first
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <ImageIcon size={24} color={colors.secondary.textGray} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={handleTyping}
                        multiline
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !inputText.trim() && styles.sendButtonDisabled,
                        ]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <AnimatedIcon
                            icon={Send}
                            size={20}
                            color={colors.secondary.white}
                            animationType="scale"
                            focused={!!inputText.trim()}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.lightGray,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        ...typography.h4,
        fontWeight: '600' as any,
        color: colors.primary.dark,
    },
    typingIndicator: {
        ...typography.caption,
        fontWeight: '400' as any,
        color: colors.primary.orange,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: colors.primary.orange,
        borderBottomRightRadius: 2,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: colors.secondary.white,
        borderBottomLeftRadius: 2,
    },
    messageText: {
        ...typography.body,
    },
    myMessageText: {
        color: colors.secondary.white,
    },
    theirMessageText: {
        color: colors.primary.dark,
    },
    timestamp: {
        ...typography.captionSmall,
        fontWeight: '400' as any,
        marginTop: 4,
        alignSelf: 'flex-end',
        opacity: 0.7,
        color: undefined,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.secondary.white,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.gray,
    },
    attachButton: {
        padding: spacing.sm,
    },
    input: {
        flex: 1,
        backgroundColor: colors.secondary.lightGray,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginHorizontal: spacing.sm,
        maxHeight: 100,
        ...typography.body,
    },
    sendButton: {
        backgroundColor: colors.primary.orange,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: colors.secondary.gray,
    },
});
