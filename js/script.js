const organizer = new Organizer();
Array.from({ length: 3 }).forEach(() => organizer.addCanvas());

function addCanvas() {
  organizer.addCanvas();
}

function removeCanvas() {
  organizer.removeCanvas();
}

function train() {
  organizer.train();
}

function fix() {
  organizer.fix();
}

function changeMaxIt(e) {
  const val = e.target.value;
  document.getElementById("max-it-label").innerText = val;
  organizer.hopfieldNetwork.setMaxIterations(val);
}
