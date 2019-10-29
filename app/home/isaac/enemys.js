var enemys = [];
var level = 0

var orde = [
  {bombers: 4, archers: 0},
  {bombers: 6, archers: 0},
  {bombers: 0, archers: 4},
  {bombers: 0, archers: 6},
  {bombers: 2, archers: 2},
  {bombers: 3, archers: 3},
  {bombers: 4, archers: 3},
  {bombers: 4, archers: 4},
  {bombers: 5, archers: 4},
  {bombers: 0, archers: 0},
  {bombers: 0, archers: 0}
]


function enemyTutto() {
  for (let i = enemys.length -1; i >= 0; i--) {
    enemys[i].muovi()
    enemys[i].mostra()
    if (enemys[i].hp <= 0) {
      score += enemys[i].points
      enemys.splice(i, 1)
    }
  }
  if (level > 8) {
    finito = true
    vinto = true
  } else if (enemys.length === 0) {
    spawnEnemys(orde[level].bombers, orde[level].archers)
    level += 1
  }
}

function spawnEnemys(bombers, archers) {
  for (let i = 0; i < bombers; i++) {
    enemys.push(new bomber(floor(random(1, 4.9))))
    if (dist(enemys[i].x, enemys[i].y, players.x, players.y) < (enemys[i].r + players.r) * 4) {
      enemys.splice(i, 1)
      i -= 1
    }
  }
  for (var i = 0; i < archers; i++) {
    enemys.push(new archer(floor(random(1, 4.9))))
    if (dist(enemys[i + bombers].x, enemys[i + bombers].y, players.x, players.y) < (enemys[i + bombers].r + players.r) * 4) {
      enemys.splice(i + bombers, 1)
      i -= 1
    }
  }
}
