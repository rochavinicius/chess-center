import { Match, MatchStatus, Room } from "@prisma/client";
import { ReturnObj } from "../../src/util/utils";
import { prismaMock } from "../singleton";

const matchService = require("../../src/services/matchService");

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

        let result = await matchService.updateMatch(updatedMatch, prismaMock);

        expect(prismaMock.match.update.mock.calls).toStrictEqual([
            [
                {
                    data: {
                        status: "READY",
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
