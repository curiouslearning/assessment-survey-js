//functions to show/hide the different containers
const landingCont = document.getElementById("landWrap");
const gameCont = document.getElementById("gameWrap");
const endCont = document.getElementById("endWrap");
function showlanding() {
    landingCont.style.display = "block";
    gameCont.style.display = "none";
    endCont.style.display = "none";
}
function showgame() {
    landingCont.style.display = "none";
    gameCont.style.display = "block";
    endCont.style.display = "none";
}
function showend() {
    landingCont.style.display = "none";
    gameCont.style.display = "none";
    endCont.style.display = "block";
}
//add button listeners
document.getElementById("answerButton1").addEventListener("click", function () {
    buttonPress(1);
});
document.getElementById("answerButton2").addEventListener("click", function () {
    buttonPress(2);
});
document.getElementById("answerButton3").addEventListener("click", function () {
    buttonPress(3);
});
document.getElementById("answerButton4").addEventListener("click", function () {
    buttonPress(4);
});
function buttonPress(num) {
    console.log(num);
}
