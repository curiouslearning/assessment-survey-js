export function setupDom() {
  document.body.innerHTML = `
    <div id="landWrap"></div>
    <div id="gameWrap"></div>
    <div id="endWrap"></div>
    <div id="starWrapper">
      <img id="star1" />
      <img id="star2" />
      <img id="star3" />
      <img id="star4" />
      <img id="star5" />
    </div>
    <div id="chestWrapper"></div>
    <div id="qWrap"></div>
    <div id="feedbackWrap"></div>
    <div id="aWrap"></div>

    <button id="answerButton1" style="visibility: visible;"></button>
    <button id="answerButton2" style="visibility: visible;"></button>
    <button id="answerButton3" style="visibility: visible;"></button>
    <button id="answerButton4" style="visibility: visible;"></button>
    <button id="answerButton5" style="visibility: visible;"></button>
    <button id="answerButton6" style="visibility: visible;"></button>

    <button id="pbutton" style="visibility: visible;"></button>
    <img id="chestImage" />
  `;
}
