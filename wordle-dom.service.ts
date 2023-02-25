enum DomSelectors {
  WORLDE_PLAYGROUND = "wordleplayground",
  //
  WORDLE = "wordle",
  ROW = "row",
  //
  WORDLE_KEYBOARD = "wordlekeyboard",
}
export enum Attributes {
  DATA_I = "data-i",
  DATA_J = "data-j",
  DATA_VALUE = "data-value",
  //
  ROW_COMPLETED = "row-completed",
  //
  INCORRECT_POSTIVE_CHAR = "incorrect-positive-move",
  CORRECT_POSTIVE_CHAR = "correct-positive-move",
  UNKNOWN_CHAR = "unknown-move",
  //
  ACTIVE_CELL = "active-cell",
  //
  HEADER_TYPE = "header-type",
  EXPOSE = "expose",
}
class Dom {
  public static readonly VALID_ALPHABETS = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
  ];
  public qS = (s: string) => document.querySelector(s);
  public updateAttr = (qS: string, attr: string, val?: any) =>
    this.qS(qS)?.setAttribute(attr, val);
  public removeAttr = (qS: string, attrs: string[]) =>
    attrs?.forEach((attr) => this.qS(qS)?.removeAttribute(attr));
  public createE = (e: string) => document.createElement(e);
  public updateInnerHTML = (qS: string, html: any) => {
    const e = this.qS(qS);
    if (e) {
      e.innerHTML = html;
    }
  };
}
export default class WordleDom extends Dom {
  private readonly STYLE = {
    delayIndex: "--delay-index",
  };
  private readonly WORLDE_PLAYGROUND = document.querySelector(
    DomSelectors.WORLDE_PLAYGROUND
  ) as HTMLElement;
  constructor() {
    super();
  }

  public setCallback({
    onKeyInput,
    onDelete,
    onEnter,
  }: {
    onDelete: () => any;
    onEnter: () => any;
    onKeyInput: (s: string) => any;
  }) {
    const sendCb = (v: string) => {
      if (v === "BACKSPACE") onDelete();
      else if (Dom.VALID_ALPHABETS.includes(v)) onKeyInput(v);
      else if (v === "ENTER") onEnter();
    };
    document.addEventListener("keyup", (e) => {
      sendCb(e.key.toUpperCase());
    });
    this.qS(DomSelectors.WORDLE_KEYBOARD)?.addEventListener(
      "click",
      (e: any) => {
        if (e?.target.localName === "button") {
          sendCb(e.target?.innerHTML);
        }
      }
    );
  }
  public initializeWordleCells({ row, col }: { row: number; col: number }) {
    this.WORLDE_PLAYGROUND.innerHTML = "";
    const worldeEle = this.createE(DomSelectors.WORDLE);
    for (let i = 0; i < col; i++) {
      const rowEle = this.createE(DomSelectors.ROW);
      for (let j = 0; j < row; j++) {
        const cellEle = this.createE("div");
        cellEle.setAttribute(Attributes.DATA_J, `${j}`);
        cellEle.setAttribute(Attributes.DATA_I, `${i}`);
        cellEle.setAttribute("style", `${this.STYLE.delayIndex}:${j}`);
        rowEle.appendChild(cellEle);
      }
      worldeEle.appendChild(rowEle);
    }
    this.WORLDE_PLAYGROUND.appendChild(worldeEle);
  }

  public setRowFinished(row: number) {
    const completedRow: any = this.qS(DomSelectors.WORDLE)?.children[row];
    completedRow?.setAttribute(Attributes.ROW_COMPLETED, "");
    for (let i = 0; i < Array.from(completedRow.children).length; i++) {
      const cell = completedRow.children[i];
      setTimeout(() => cell.setAttribute(Attributes.EXPOSE, ""), i * 450);
    }
  }

  public updateCellStatus({
    status,
    activeRow,
    activeRowIndex,
  }: {
    activeRow: number;
    activeRowIndex: number;
    status:
      | Attributes.UNKNOWN_CHAR
      | Attributes.INCORRECT_POSTIVE_CHAR
      | Attributes.CORRECT_POSTIVE_CHAR;
  }) {
    const qS = this.getCell(activeRowIndex, activeRow); // `div[${Attributes.DATA_I}='${activeRowIndex}'][${Attributes.DATA_J}='${activeRow}']`;
    if (status === Attributes.UNKNOWN_CHAR) {
      this.removeAttr(qS, [
        Attributes.INCORRECT_POSTIVE_CHAR,
        Attributes.CORRECT_POSTIVE_CHAR,
      ]);
      return;
    }
    this.updateAttr(qS, status, "1");
  }

  public toggleActiveCell({
    flag,
    activeRow,
    activeRowIndex,
  }: {
    flag: boolean;
    activeRow: number;
    activeRowIndex: number;
  }) {
    const qS = this.getCell(activeRowIndex, activeRow); // `div[${Attributes.DATA_I}='${activeRowIndex}'][${Attributes.DATA_J}='${activeRow}']`;
    if (flag) {
      this.updateAttr(qS, Attributes.ACTIVE_CELL, "true");
      return;
    }
    this.removeAttr(qS, [Attributes.ACTIVE_CELL]);
  }

  public updatePlaygroundCell({
    value,
    activeRow,
    activeRowIndex,
  }: {
    value: string;
    activeRow: number;
    activeRowIndex: number;
  }) {
    const qS = this.getCell(activeRowIndex, activeRow); //`div[${Attributes.DATA_I}='${activeRowIndex}'][${Attributes.DATA_J}='${activeRow}']`;
    this.updateInnerHTML(qS, value.toUpperCase());
    this.updateAttr(qS, Attributes.DATA_VALUE, value);
  }

  private getCell(j: number, i: number) {
    return `div[${Attributes.DATA_I}='${i}'][${Attributes.DATA_J}='${j}']`;
  }

  public gameOverUI(won?: boolean) {
    const welcomeEle = this.qS(`section[${Attributes.HEADER_TYPE}='welcome']`);
    if (welcomeEle?.classList?.contains("display-none")) return;
    welcomeEle?.classList.add("display-none");
    this.qS(
      `section[${Attributes.HEADER_TYPE}='${(!!won && "won") || "lost"}']`
    )?.classList.remove("display-none");
  }
}
