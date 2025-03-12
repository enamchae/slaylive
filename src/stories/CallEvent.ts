export type ChatMessage = {
    user: {
        id: string,
        name: string,
    },
    text: string,
};

export type CallEvent<EventType extends "chat" | "react"=any> = {
    type: EventType,
    data:
        EventType extends "chat" ? ChatMessage :
        never,
};