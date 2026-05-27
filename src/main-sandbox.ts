// console.log("Conway life game");

const s = "CONWAY LIFE SIMULATOR\nGRID: 60x30\nGENERATION: 421\n\n";
const s2 =
  "Generation: 128\n\n\
..................................................\n\
..............██..................................\n\
...............██.................................\n\
.............███..................................\n\
..................................................\n\n";
let s3 = "";
for (let y = 0; y < 30; y++) {
  for (let x = 0; x < 60; x++) {
    s3 += ".";
  }
  s3 += "\n";
}

process.stdout.write(s);
process.stdout.write(s2);
process.stdout.write(s3);

while (true) {}
