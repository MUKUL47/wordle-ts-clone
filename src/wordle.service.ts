import WordleDom, { Attributes } from "./wordle-dom.service";
import words from "./words";
// type Word = { value: string };
export default class Wordle extends WordleDom {
  private readonly WORDLE_ROW = 5;
  private readonly WORDLE_COL = 5;
  //   private wordlePlayground: Array<Array<Word>> = this.getEmptyPlayground();
  private activeRow: number = 0;
  private activeRowIndex: number = 0;
  private randomWord: string = "";
  private correctGuessCounter = 0;
  private gameOver = false;
  //   private gameStatus: GameStatus = GameStatus.IN_PROGRESS;

  constructor() {
    super();
    this.setCallback({
      onKeyInput: this.onKeyInput,
      onDelete: this.onDelete,
    });
    this.initializeRandomWord();
    this.initializeWordleCells({ row: this.WORDLE_ROW, col: this.WORDLE_COL });
    this.toggleActiveCell({
      flag: true,
      ...this.coord(),
    });
  }

  //   private getEmptyPlayground(): Array<Array<Word>> {
  //     const playGround: Array<Array<Word>> = [];
  //     for (let i = 0; i < this.WORDLE_COL; i++) {
  //       const col: Array<Word> = [];
  //       for (let j = 0; j < this.WORDLE_ROW; j++) {
  //         col.push({
  //           value: "",
  //         } as Word);
  //       }
  //       playGround.push(col);
  //     }
  //     return playGround;
  //   }
  private initializeRandomWord() {
    this.randomWord =
      words[Math.floor(Math.random() * words.length)].toUpperCase();
  }

  private checkWin(correctGuess: boolean) {
    correctGuess && this.correctGuessCounter++;
    this.gameOver = this.correctGuessCounter === this.WORDLE_COL;
    if (this.gameOver) {
      //tell ui to show success message
      this.gameOverUI(true);
    }
  }

  private checkCellStatus(key: string) {
    const hasMatch = this.randomWord.includes(key);
    const hasIndexMatch = this.randomWord[this.activeRowIndex] === key;
    const status =
      !hasMatch && !hasIndexMatch
        ? Attributes.UNKNOWN_CHAR
        : !hasIndexMatch
        ? Attributes.INCORRECT_POSTIVE_CHAR
        : Attributes.CORRECT_POSTIVE_CHAR;
    this.updateCellStatus({
      status,
      activeRow: this.activeRow,
      activeRowIndex: this.activeRowIndex,
    });
    this.checkWin(hasIndexMatch);
  }

  private onDelete = () => {
    if (this.activeRowIndex === 0 || this.activeRow >= this.WORDLE_COL) return;
    this.toggleActiveCell({
      flag: false,
      ...this.coord(),
    });
    this.activeRowIndex--;
    this.toggleActiveCell({
      flag: true,
      ...this.coord(),
    });
    const coords = this.coord();
    this.updateCellStatus({
      status: Attributes.UNKNOWN_CHAR,
      ...coords,
    });
    this.updatePlaygroundCell({
      value: "",
      ...coords,
    });
  };

  private onKeyInput = (value: string) => {
    if (this.gameOver) return;

    this.toggleActiveCell({
      flag: false,
      ...this.coord(),
    });
    value = value.toUpperCase();
    this.checkCellStatus(value);
    // this.wordlePlayground[this.activeRow][this.activeRowIndex].value = value;
    this.updatePlaygroundCell({
      ...this.coord(),
      value,
    });
    this.activeRowIndex++;
    if (this.activeRowIndex >= this.WORDLE_ROW) {
      this.correctGuessCounter = 0;
      this.setRowFinished(this.activeRow);
      this.activeRow += 1;
      if (this.activeRow >= this.WORDLE_COL) {
        this.gameOverUI();
      }
    }
    this.activeRowIndex %= this.WORDLE_ROW;
    this.toggleActiveCell({
      flag: true,
      ...this.coord(),
    });
  };

  private coord = () => {
    return { activeRow: this.activeRow, activeRowIndex: this.activeRowIndex };
  };

  //   isGameFinished(): boolean {}
}
