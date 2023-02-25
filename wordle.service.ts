import WordleDom, { Attributes } from "./wordle-dom.service";
import words from "./words";
type Word = { value: string };
export default class Wordle extends WordleDom {
  private readonly WORDLE_ROW = 5;
  private readonly WORDLE_COL = 5;
  private wordlePlayground: Array<Array<Word>> = this.getEmptyPlayground();
  private activeRow: number = 0;
  private activeRowIndex: number = 0;
  private randomWord: string = "";
  private gameOver = false;
  private rowFinished = false;

  constructor() {
    super();
    this.setCallback({
      onKeyInput: (v) => !this.gameOver && this.onKeyInput(v),
      onDelete: () => !this.gameOver && this.onDelete(),
      onEnter: () => !this.gameOver && this.onEnter(),
    });
    this.initializeRandomWord();
    this.initializeWordleCells({ row: this.WORDLE_ROW, col: this.WORDLE_COL });
    this.toggleActiveCell({
      flag: true,
      ...this.coord(),
    });
  }

  private getEmptyPlayground(): Array<Array<Word>> {
    const playGround: Array<Array<Word>> = [];
    for (let i = 0; i < this.WORDLE_COL; i++) {
      const col: Array<Word> = [];
      for (let j = 0; j < this.WORDLE_ROW; j++) {
        col.push({
          value: "",
        } as Word);
      }
      playGround.push(col);
    }
    return playGround;
  }
  private initializeRandomWord() {
    this.randomWord =
      words[Math.floor(Math.random() * words.length)]!.toUpperCase();
  }

  private checkWin() {
    this.gameOver =
      this.wordlePlayground[this.activeRow]?.map((v) => v.value).join("") ===
      this.randomWord;
    if (this.gameOver) {
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
  }

  private onDelete = () => {
    if (this.activeRowIndex === 0 || this.activeRow >= this.WORDLE_COL) return;
    this.rowFinished = false;
    this.toggleActiveCell({
      flag: false,
      ...this.coord(),
    });
    this.activeRowIndex--;
    const cellsToInterate = [this.activeRowIndex, this.activeRowIndex + 1];
    this.toggleActiveCell({
      flag: true,
      ...this.coord(),
    });
    const coords = this.coord();
    cellsToInterate.forEach((i) => {
      this.updateCellStatus({
        status: Attributes.UNKNOWN_CHAR,
        ...coords,
        activeRowIndex: i,
      });
      this.updatePlaygroundCell({
        value: "",
        ...coords,
        activeRowIndex: i,
      });
    });
  };

  private onKeyInput = (value: string) => {
    if (this.gameOver || this.activeRowIndex === this.WORDLE_ROW) return;
    this.toggleActiveCell({
      flag: false,
      ...this.coord(),
    });
    value = value.toUpperCase();
    this.wordlePlayground[this.activeRow]![this.activeRowIndex]!.value = value;
    this.checkCellStatus(value);
    this.updatePlaygroundCell({
      ...this.coord(),
      value,
    });
    this.rowFinished = this.activeRowIndex === this.WORDLE_COL - 1;
    if (this.activeRowIndex < this.WORDLE_ROW - 1) {
      this.activeRowIndex++;
    }
    this.toggleActiveCell({
      flag: true,
      ...this.coord(),
    });
  };

  private onEnter = () => {
    this.checkWin();
    if (!this.rowFinished || this.activeRowIndex < this.WORDLE_ROW - 1) return;
    this.setRowFinished(this.activeRow);
    this.toggleActiveCell({
      flag: false,
      ...this.coord(),
    });
    this.activeRowIndex = 0;
    this.rowFinished = false;
    this.activeRow += 1;
    if (this.activeRow >= this.WORDLE_COL) {
      this.gameOver = true;
      this.gameOverUI();
      return;
    }
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
