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

export type LivestreamUpdateListing = {
    listing: {
        id: string,
        price: string,
        title: string,
        description: string,
        active: boolean,
        // images: string[],
    },
};

export enum LivestreamEventType {
    Chat = "chat",
    React = "react",
    UpdateListing = "update listing",
}

export type LivestreamEvent<EventType extends LivestreamEventType=LivestreamEventType> = {
    type: EventType,
    data:
        EventType extends LivestreamEventType.Chat ? LivestreamChatMessage :
        EventType extends LivestreamEventType.React ? LivestreamReaction :
        EventType extends LivestreamEventType.UpdateListing ? LivestreamUpdateListing :
        never,
};