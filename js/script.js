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
