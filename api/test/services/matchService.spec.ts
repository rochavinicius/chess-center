import { Board, Match, MatchStatus, Room } from "@prisma/client";
import { ReturnObj } from "../../src/util/utils";
import { prismaMock } from "../singleton";

const matchService = require("../../src/services/matchService");
const boardService = require("../../src/services/boardService");

const defaultDate = new Date();

const defaultNewMatch = {
    id: "1",
    roomId: "1",
    status: MatchStatus.READY,
    whiteName: "white",
    blackName: "black",
    createdAt: defaultDate,
    startTimestamp: undefined,
    endTimestamp: undefined,
    winner: undefined,
};

let mockRoom: Room = {
    id: "a6eab837-1ea2-4020-a5dc-88fc8440aa5a",
    name: "test",
    status: "OPEN",
    mode: "MULTIPLAYER",
    chat_mode: "PRIVATE",
    visibility: "PRIVATE",
    room_url:
        "http://127.0.0.1:3000/api/room/a6eab837-1ea2-4020-a5dc-88fc8440aa5a",
    created_by: "white",
    player_one: "white",
    player_two: "black",
    player_one_score: 0,
    player_two_score: 0,
    viewers: 0,
    created_at: defaultDate,
};

let mockMatch: Match = {
    id: "c124c7fa-f0bd-441a-9137-1342b72072c6",
    room_id: "a6eab837-1ea2-4020-a5dc-88fc8440aa5a",
    status: "READY",
    white_name: "white",
    black_name: "black",
    winner: null,
    start_timestamp: null,
    end_timestamp: null,
    created_at: defaultDate,
};

let mockBoard: Board = {
    id: "4311e874-b593-456b-809e-9d712deaf161",
    match_id: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
    state: "rnbqkbnr/ppppp2p/8/5PpQ/8/8/PPPP1PPP/RNB1KBNR b KQkq - 1 3",
    created_at: defaultDate,
};

const defaultToken = {
    name: "white",
};

let mockListUsers = jest.fn().mockReturnValue({
    users: [
        {
            displayName: "white",
        },
        {
            displayName: "black",
        },
    ],
});

jest.mock("../../src/auth/firebase", () => {
    return {
        listUsers: () => mockListUsers(),
    };
});

describe("matchService", () => {
    beforeEach(() => {
        mockMatch.status = MatchStatus.READY;
    });

    afterEach(() => {
        jest.resetAllMocks();
        mockListUsers = jest.fn().mockReturnValue({
            users: [
                {
                    displayName: "white",
                },
                {
                    displayName: "black",
                },
            ],
        });
    });

    test("Should not create match with invalid room", async () => {
        const expectedRet: ReturnObj = {
            message: "Invalid room",
            success: false,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "create");
        prismaMock.room.findUnique.mockResolvedValue(null);

        let result = await matchService.addMatch(defaultNewMatch, prismaMock);

        expect(createMatchSpy).not.toHaveBeenCalled();
        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not create match with room closed", async () => {
        const expectedRet: ReturnObj = {
            message: "Room closed",
            success: false,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "create");
        prismaMock.room.findUnique.mockResolvedValue({
            id: "1",
            status: "CLOSED",
        } as Room);

        let result = await matchService.addMatch(defaultNewMatch, prismaMock);

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).not.toHaveBeenCalled();
    });

    test("Should not create match with invalid status", async () => {
        const expectedRet: ReturnObj = {
            message: "Invalid match status",
            success: false,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "create");
        prismaMock.room.findUnique.mockResolvedValue({
            id: "1",
            status: "OPEN",
        } as Room);

        let invalidMatch = { ...defaultNewMatch } as any;
        invalidMatch.status = "INVALID";

        let result = await matchService.addMatch(invalidMatch, prismaMock);

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).not.toHaveBeenCalled();
    });

    test("Should not create match for another players", async () => {
        const expectedRet: ReturnObj = {
            message: "Cannot create match for another players",
            success: false,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "create");
        prismaMock.room.findUnique.mockResolvedValue({
            id: "1",
            status: "OPEN",
        } as Room);

        let token = { ...defaultToken };
        token.name = "grey";

        let result = await matchService.addMatch(
            defaultNewMatch,
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).not.toHaveBeenCalled();
    });

    test("Should not create match with black and white equals", async () => {
        const expectedRet: ReturnObj = {
            message: "White and black player names are the same",
            success: false,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "create");
        prismaMock.room.findUnique.mockResolvedValue({
            id: "1",
            status: "OPEN",
        } as Room);

        let invalidMatch = { ...defaultNewMatch } as any;
        invalidMatch.blackName = invalidMatch.whiteName;

        let result = await matchService.addMatch(
            invalidMatch,
            prismaMock,
            defaultToken
        );

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).not.toHaveBeenCalled();
    });

    test("Should not create match if white does not exist", async () => {
        const expectedRet: ReturnObj = {
            message: "White user does not exists",
            success: false,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "create");
        prismaMock.room.findUnique.mockResolvedValue({
            id: "1",
            status: "OPEN",
        } as Room);

        mockListUsers = jest.fn().mockReturnValue({
            users: [
                {
                    displayName: "grey",
                },
                {
                    displayName: "black",
                },
            ],
        });

        let result = await matchService.addMatch(
            defaultNewMatch,
            prismaMock,
            defaultToken
        );

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).not.toHaveBeenCalled();
    });

    test("Should not create match if black does not exist", async () => {
        const expectedRet: ReturnObj = {
            message: "Black user does not exists",
            success: false,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "create");
        prismaMock.room.findUnique.mockResolvedValue({
            id: "1",
            status: "OPEN",
        } as Room);

        mockListUsers = jest.fn().mockReturnValue({
            users: [
                {
                    displayName: "white",
                },
                {
                    displayName: "grey",
                },
            ],
        });

        let result = await matchService.addMatch(
            defaultNewMatch,
            prismaMock,
            defaultToken
        );

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).not.toHaveBeenCalled();
    });

    test("Should create match", async () => {
        const expectedRet: ReturnObj = {
            message: "Match created",
            success: true,
            obj: {
                id: defaultNewMatch.id,
                roomId: defaultNewMatch.roomId,
                status: defaultNewMatch.status,
                whiteName: defaultNewMatch.whiteName,
                blackName: defaultNewMatch.blackName,
                createdAt: defaultDate,
                winner: undefined,
                startTimestamp: undefined,
                endTimestamp: undefined,
            },
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "create");
        prismaMock.room.findUnique.mockResolvedValue({
            id: "1",
            status: "OPEN",
        } as Room);
        prismaMock.match.create.mockResolvedValue({
            id: defaultNewMatch.id,
            room_id: defaultNewMatch.roomId,
            status: defaultNewMatch.status,
            white_name: defaultNewMatch.whiteName,
            black_name: defaultNewMatch.blackName,
            created_at: defaultDate,
        } as Match);

        let result = await matchService.addMatch(
            defaultNewMatch,
            prismaMock,
            defaultToken
        );

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).toHaveBeenCalled();
    });

    test("Should not update match not found", async () => {
        const expectedRet: ReturnObj = {
            message: "Match not found",
            success: false,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "update");
        prismaMock.match.findUnique.mockResolvedValue(null);

        let result = await matchService.updateMatch(
            defaultNewMatch,
            prismaMock
        );

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).not.toHaveBeenCalled();
    });

    test("Should update match", async () => {
        const expectedRet: ReturnObj = {
            message: "Match updated",
            success: true,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "update");
        prismaMock.match.findUnique.mockResolvedValue({
            id: defaultNewMatch.id,
            room_id: defaultNewMatch.roomId,
        } as Match);

        let updatedMatch = { ...defaultNewMatch } as any;
        updatedMatch.winner = updatedMatch.whiteName;
        updatedMatch.startTimestamp = new Date("January 28, 2024 03:24:00");
        updatedMatch.endTimestamp = new Date("January 28, 2024 03:25:00");

        let result = await matchService.updateMatch(updatedMatch, prismaMock);

        expect(prismaMock.match.update.mock.calls).toStrictEqual([
            [
                {
                    data: {
                        status: "READY",
                        start_timestamp: updatedMatch.startTimestamp,
                        end_timestamp: updatedMatch.endTimestamp,
                        winner: updatedMatch.winner,
                    },
                    where: {
                        id: updatedMatch.id,
                    },
                },
            ],
        ]);
        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).toHaveBeenCalled();
    });

    test("Should not do command when match not found", async () => {
        let expectedRet: ReturnObj = {
            message: "Match not found",
            success: false,
        };

        prismaMock.match.findUnique.mockResolvedValue(null);

        let result = await matchService.commandMatch(
            "asdas",
            "FORFEITH",
            prismaMock,
            defaultToken
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not do command when command invalid", async () => {
        let expectedRet: ReturnObj = {
            message: "Invalid command",
            success: false,
        };

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await matchService.commandMatch(
            "asdas",
            "sdad",
            prismaMock,
            defaultToken
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not do command forfeith when match is over", async () => {
        let expectedRet: ReturnObj = {
            message: "Match is already over",
            success: false,
        };

        mockMatch.status = MatchStatus.FINISHED;

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await matchService.commandMatch(
            "asdas",
            "FORFEITH",
            prismaMock,
            defaultToken
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not do command forfeith when invalid user", async () => {
        let expectedRet: ReturnObj = {
            message: "Invalid user",
            success: false,
        };
        let token = {
            name: "",
        };

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await matchService.commandMatch(
            "asdas",
            "FORFEITH",
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not do command forfeith when user not a player", async () => {
        let expectedRet: ReturnObj = {
            message: "User not a player",
            success: false,
        };
        let token = {
            name: "asd",
        };

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await matchService.commandMatch(
            "asdas",
            "FORFEITH",
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should do command forfeith", async () => {
        let expectedRet: ReturnObj = {
            message: "Success",
            success: true,
        };
        let token = {
            name: "white",
        };

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await matchService.commandMatch(
            "asdas",
            "FORFEITH",
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not do command remake when match is over", async () => {
        let expectedRet: ReturnObj = {
            message: "Match is already over",
            success: false,
        };
        let token = {
            name: "white",
        };

        mockMatch.status = MatchStatus.FINISHED;

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await matchService.commandMatch(
            "asdas",
            "REMAKE",
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not do command remake when error remaking board", async () => {
        let expectedRet: ReturnObj = {
            message: "Error trying to remake the board",
            success: false,
        };
        let token = {
            name: "Test User",
        };

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await matchService.commandMatch(
            "asdas",
            "REMAKE",
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should do command remake", async () => {
        let expectedRet: ReturnObj = {
            message: "Success",
            success: true,
        };
        let token = {
            name: "white",
        };

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);
        prismaMock.board.update.mockResolvedValue(mockBoard);

        let result = await matchService.commandMatch(
            "asdas",
            "REMAKE",
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not do command rematch when current match not over", async () => {
        let expectedRet: ReturnObj = {
            message: "Current match not finished",
            success: false,
        };
        let token = {
            name: "white",
        };

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await matchService.commandMatch(
            "asdas",
            "REMATCH",
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not do command rematch when error creating match", async () => {
        let expectedRet: ReturnObj = {
            message: "Error trying to create new match",
            success: false,
        };
        let token = {
            name: "Test User",
        };

        mockMatch.status = MatchStatus.FINISHED;

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await matchService.commandMatch(
            "asdas",
            "REMATCH",
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not do command rematch when error creating board", async () => {
        let expectedRet: ReturnObj = {
            message: "Error trying to create new board",
            success: false,
        };
        let token = {
            name: "white",
        };

        mockMatch.status = MatchStatus.FINISHED;

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);
        prismaMock.room.findUnique.mockResolvedValue(mockRoom);
        prismaMock.match.create.mockResolvedValue({
            id: defaultNewMatch.id,
            room_id: defaultNewMatch.roomId,
            status: defaultNewMatch.status,
            white_name: defaultNewMatch.whiteName,
            black_name: defaultNewMatch.blackName,
            created_at: defaultDate,
        } as Match);
        jest.spyOn(boardService, "addBoard").mockImplementation(jest.fn());
        boardService.addBoard.mockResolvedValue({
            message: "Error",
            success: false,
        });

        let result = await matchService.commandMatch(
            "asdas",
            "REMATCH",
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should do command rematch", async () => {
        let expectedRet: ReturnObj = {
            message: "Success",
            success: true,
        };
        let token = {
            name: "white",
        };

        mockMatch.status = MatchStatus.FINISHED;

        prismaMock.match.findUnique.mockResolvedValue(mockMatch);
        prismaMock.room.findUnique.mockResolvedValue(mockRoom);
        prismaMock.match.create.mockResolvedValue({
            id: defaultNewMatch.id,
            room_id: defaultNewMatch.roomId,
            status: defaultNewMatch.status,
            white_name: defaultNewMatch.whiteName,
            black_name: defaultNewMatch.blackName,
            created_at: defaultDate,
        } as Match);
        jest.spyOn(boardService, "addBoard").mockImplementation(jest.fn());
        boardService.addBoard.mockResolvedValue({
            message: "Success",
            success: true,
        });

        let result = await matchService.commandMatch(
            "asdas",
            "REMATCH",
            prismaMock,
            token
        );

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should get empty matches", async () => {
        const expectedRet: ReturnObj = {
            message: "Matches found",
            success: true,
            obj: [],
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "findMany");
        prismaMock.match.findMany.mockResolvedValue([]);

        let result = await matchService.getMatches();

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).toHaveBeenCalled();
    });

    test("Should get all matches", async () => {
        const expectedRet: ReturnObj = {
            message: "Matches found",
            success: true,
            obj: [defaultNewMatch, defaultNewMatch, defaultNewMatch],
        };

        let mapToPrismaEntity = (defaultJsonMatch: any) => {
            return {
                id: defaultJsonMatch.id,
                room_id: defaultJsonMatch.roomId,
                status: defaultJsonMatch.status,
                white_name: defaultJsonMatch.whiteName,
                black_name: defaultJsonMatch.blackName,
                created_at: defaultJsonMatch.createdAt,
                start_timestamp: defaultJsonMatch.startTimestamp,
                end_timestamp: defaultJsonMatch.endTimestamp,
                winner: defaultJsonMatch.winner,
            } as Match;
        };

        let matchesList = [
            mapToPrismaEntity(defaultNewMatch),
            mapToPrismaEntity(defaultNewMatch),
            mapToPrismaEntity(defaultNewMatch),
        ];

        const createMatchSpy = jest.spyOn(prismaMock.match, "findMany");
        prismaMock.match.findMany.mockResolvedValue(matchesList);

        let result = await matchService.getMatches();

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).toHaveBeenCalled();
    });

    test("Should get match by id", async () => {
        const expectedRet: ReturnObj = {
            message: "Match found",
            success: true,
            obj: defaultNewMatch,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "findUnique");
        prismaMock.match.findUnique.mockResolvedValue({
            id: "1",
            room_id: "1",
            status: MatchStatus.READY,
            white_name: "white",
            black_name: "black",
            created_at: defaultDate,
        } as Match);

        let result = await matchService.getMatchById("1");

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).toHaveBeenCalled();
    });

    test("Should not find match by id", async () => {
        const expectedRet: ReturnObj = {
            message: "Match not found",
            success: false,
        };

        const createMatchSpy = jest.spyOn(prismaMock.match, "findUnique");
        prismaMock.board.findUnique.mockResolvedValue(null);

        let result = await matchService.getMatchById("1");

        expect(result).toStrictEqual(expectedRet);
        expect(createMatchSpy).toHaveBeenCalled();
    });
});
