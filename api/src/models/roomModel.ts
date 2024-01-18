import { Mode, PrivacyLevel, RoomStatus } from "@prisma/client";
import { MatchModel, matchModelFromPrisma } from "./matchModel";

export interface RoomModel {
    id: string;
    name: string;
    status: RoomStatus;
    mode: Mode;
    chatMode: PrivacyLevel;
    visibility: PrivacyLevel;
    roomUrl: string;
    createdBy: string;
    playerOne: string;
    playerTwo: string;
    playerOneScore: Number;
    playerTwoScore: Number;
    viewers: Number;
    createdAt: Date;
    matches: MatchModel[];
}

export const roomModelFromPrisma = (prismaRoom: any) => {
    const room: RoomModel = {
        id: prismaRoom.id,
        name: prismaRoom.name,
        status: prismaRoom.status,
        mode: prismaRoom.mode,
        chatMode: prismaRoom.chat_mode,
        visibility: prismaRoom.visibility,
        roomUrl: prismaRoom.room_url,
        createdBy: prismaRoom.created_by,
        playerOne: prismaRoom.player_one,
        playerTwo: prismaRoom.player_two,
        playerOneScore: prismaRoom.player_one_score,
        playerTwoScore: prismaRoom.player_two_score,
        viewers: prismaRoom.viewers,
        createdAt: prismaRoom.created_at,
        matches: [],
    }

    if (prismaRoom.match) {
        for (let prismaMatch of prismaRoom.match) {
            room.matches.push(matchModelFromPrisma(prismaMatch));
        }
    }
    
    return room;
}
