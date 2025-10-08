declare module 'chess.js' {
    export type Board = (Piece | null)[][];

    interface Piece {
        type: 'q' | 'r' | 'n' | 'b' | 'k' | 'p';
        color: 'b' | 'w';
    }

    type Col = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
    type Row = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
    export type Position = `${Col}${Row}`;

    interface Move {
        color: 'w' | 'b';
        from: Position;
        to: Position;
        piece: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
        captured?: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
        promotion?: 'q' | 'r' | 'n' | 'b';
        flags: string;
        san: string;
    }

    export class Chess {
        constructor(fen?: string);
        moves(options?: { verbose?: boolean; square?: Position }): Move[] | string[];
        move(move: string | { from: string; to: string; promotion?: 'q' | 'r' | 'n' | 'b' }): Move | null;
        board(): Board;
        undo(): Move | null;
        reset(): void;
        fen(): string;
        pgn(): string;
        load(fen: string): void;
        isCheckmate(): boolean;
        isDraw(): boolean;
        isStalemate(): boolean;
        isCheck(): boolean;
        isGameOver(): boolean;
        turn(): 'w' | 'b';
        get(square: Position): Piece | null;
        put(piece: { type: Piece['type']; color: Piece['color'] }, square: Position): boolean;
        remove(square: Position): Piece | null;
    }
}
