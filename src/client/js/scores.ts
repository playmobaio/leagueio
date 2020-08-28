import { IScore } from "../../server/models/iScore";

function ToDateTime(secs): Date {
  const t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}

function createAndAppend(parent: HTMLElement, content: string): void {
  const div = document.createElement("div");
  div.textContent = content;
  parent.appendChild(div);
}

function createRow(parent: HTMLElement, col1: string, col2: string, col3: string): void {
  const container = document.createElement("div");
  container.classList.add("justify-content-between", "d-flex", "score-entry");

  createAndAppend(container, col1);
  createAndAppend(container, col2);
  createAndAppend(container, col3);

  parent.appendChild(container);
}

export function CreateScoreEntries(scores: IScore[]): HTMLElement {
  const entries = document.createElement("div");
  entries.setAttribute("id", "entries");
  entries.classList.add("panel", "entries-active");

  createRow(entries, "NAME", "SCORE", "DATE");
  const divider = document.createElement("hr");
  divider.classList.add("margin-0");
  entries.appendChild(divider);

  scores.forEach(score => {
    // Values should look like:
    // <div class="justify-content-between d-flex">
    //   <div>1. Bob</div>
    //   <div>10000</div>
    //   <div>08/09/2020</div>
    // </div>
    createRow(
      entries,
      score.name,
      score.score.toString(),
      ToDateTime(score.date["_seconds"]).toLocaleDateString());
  });
  return entries;
}

