import { RoomStatus, Mode, PrivacyLevel } from "./enums"

export interface RoomModel {
    id: String,
    name: String,
    status: RoomStatus,
    mode: Mode,
    chatMode: PrivacyLevel,
    visibility: PrivacyLevel,
    roomUrl: String,
    playerOne: String,
    playerTwo: String,
    playerOneScore: Number, 
    playerTwoScore: Number, 
    viewers: Number, 
    createdAt: Date,
}