function State(score, grid) {
  this.score = score;
  this.grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  for (var i = 0; i < 4; ++ i) for (var j = 0; j < 4; ++ j) {
    this.grid[i][j] = grid[i][j];
  }
}

State.prototype.input = function (dir) {
  var changed = false;
  var dx = [0, 1, 0, -1][dir];
  var dy = [-1, 0, 1, 0][dir];
  var x0 = [0, 3, 3, 0][dir];
  var y0 = [0, 0, 3, 3][dir];
  for (var i = 0; i < 4; ++ i) {
    var x, y, z;
    var a = [];
    x = x0; y = y0, z = true;
    for (var j = 0; j < 4; ++ j) {
      if (this.grid[x][y]) {
        if (z && a.length > 0 && a[a.length-1] == this.grid[x][y]) {
          a[a.length-1] *= 2;
          this.score += a[a.length-1];
          z = false;
        } else {
          a.push(this.grid[x][y]);
          z = true;
        }
      }
      x -= dx; y -= dy;
    }
    x = x0; y = y0;
    for (var j = 0; j < 4; ++ j) {
      var p = this.grid[x][y];
      this.grid[x][y] = j < a.length ? a[j] : 0;
      if (p != this.grid[x][y]) changed = true;
      x -= dx; y -= dy;
    }
    x0 -= dy;
    y0 += dx;
  }
  return changed;
};

function dfs(depth, state) {
  if (depth <= 0) return state.score;
  if (depth % 2) {
    var max_score = state.score;
    for (var i = 0; i < 4; ++ i) {
      var ss = new State(state.score, state.grid);
      if (ss.input(i)) {
        max_score = Math.max(max_score, dfs(depth-1, ss));
      }
    }
    return max_score;
  } else {
    var min_score = 1e+300;
    for (var i = 0; i < 4; ++ i) for (var j = 0; j < 4; ++ j) {
      if (state.grid[i][j] == 0) {
        state.grid[i][j] = 2;
        min_score = Math.min(min_score, dfs(depth-1, state));
        state.grid[i][j] = 4;
        min_score = Math.min(min_score, dfs(depth-1, state));
        state.grid[i][j] = 0;
      }
    }
    if (min_score == 1e+300) min_score = state.score;
    return min_score;
  }
};

function calcScore (game, tile) {
  var grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  for (var i = 0; i < 4; ++ i) for (var j = 0; j < 4; ++ j) {
    if (game.grid.cells[i][j]) {
      grid[i][j] = game.grid.cells[i][j].value;
    }
  }
  grid[tile.x][tile.y] = tile.value;
  return dfs(3, new State(game.score, grid));
}
