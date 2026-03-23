const getParticipant = (message, currentUserId) =>
  message.senderRef?._id === currentUserId ? message.receiverRef : message.senderRef;

export const buildConversations = (messages, currentUserId) => {
  const groups = new Map();

  messages.forEach((message) => {
    const participant = getParticipant(message, currentUserId);
    const listing = message.listingRef;

    if (!participant?._id || !listing?._id) {
      return;
    }

    const key = `${listing._id}:${participant._id}`;
    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, {
        key,
        listing,
        participant,
        messages: [message],
        unreadCount:
          message.receiverRef?._id === currentUserId && !message.isRead ? 1 : 0,
        updatedAt: message.createdAt,
      });
      return;
    }

    existing.messages.push(message);
    existing.updatedAt =
      new Date(existing.updatedAt) > new Date(message.createdAt)
        ? existing.updatedAt
        : message.createdAt;

    if (message.receiverRef?._id === currentUserId && !message.isRead) {
      existing.unreadCount += 1;
    }
  });

  return [...groups.values()]
    .map((conversation) => ({
      ...conversation,
      messages: conversation.messages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      ),
    }))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};
