import { RoomStatus, Mode, PrivacyLevel } from "./enums"

export interface RoomModel {
    id: string,
    name: string,
    status: RoomStatus,
    mode: Mode,
    chatMode: PrivacyLevel,
    visibility: PrivacyLevel,
    roomUrl: string,
    playerOne: string,
    playerTwo: string,
    playerOneScore: Number, 
    playerTwoScore: Number, 
    viewers: Number, 
    createdAt: Date,
}