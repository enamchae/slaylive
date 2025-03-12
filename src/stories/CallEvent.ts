export type LivestreamChatMessage = {
    user: {
        id: string,
        name: string,
    },
    text: string,
};

export type LivestreamReaction = {
    emoji: string,
};

export type CallEvent<EventType extends "chat" | "react"="chat" | "react"> = {
    type: EventType,
    data:
        EventType extends "chat" ? LivestreamChatMessage :
        EventType extends "react" ? LivestreamReaction :
        never,
};