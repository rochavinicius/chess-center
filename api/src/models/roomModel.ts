// import { RoomStatus, Mode, PrivacyLevel } from "./enums";
import { MatchModel } from "./matchModel";
import { Mode, PrivacyLevel, RoomStatus } from "@prisma/client";

export interface RoomModel {
    id: string;
    name: string;
    status: RoomStatus;
    mode: Mode;
    chatMode: PrivacyLevel;
    visibility: PrivacyLevel;
    roomUrl: string;
    playerOne: string;
    playerTwo: string;
    playerOneScore: Number;
    playerTwoScore: Number;
    viewers: Number;
    createdAt: Date;
    matches: MatchModel[];
}
