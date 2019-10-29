export default class TileCollider {
  constructor(level) {
    this.level = level
    this.tileResolver = level.tileResolver
    this.bID = level.bID
  }

  checkX(entity) {
    let x;
    if (entity.xv > 0) {
      x = entity.x + entity.w;
    } else if (entity.xv < 0) {
      x = entity.x;
    } else {
      return;
    }

    const matches = this.tileResolver.searchByRange(x, x, entity.y, entity.y + entity.h);

      matches.forEach(match => {
        if (!this.bID.isSolid(match.tile)) {
          return;
        }
        //console.log(match);

        if (entity.xv > 0) {
          if (entity.x + entity.w > match.x1) {
            if(entity.cjoob && this.canStayOn(entity.x, entity.y - 16, entity.w, entity.h)) {
              entity.y -= 16
            } else {
              entity.x = match.x1 - entity.w;
              entity.xv = 0;
            }
          }
        } else if (entity.xv < 0) {
          if (entity.x < match.x2) {
            if(entity.cjoob && this.canStayOn(entity.x, entity.y - 16, entity.w, entity.h)) {
              entity.y -= 16
            } else {
              entity.x = match.x2;
              entity.xv = 0;
            }
          }
        }
      });
    }

    checkY(entity) {
      let y;
      if (entity.yv > 0) {
        y = entity.y + entity.h;
      } else if (entity.yv < 0) {
        y = entity.y;
      } else {
        return;
      }

      const matches = this.tileResolver.searchByRange(
        entity.x, entity.x + entity.w,
        y, y);

        matches.forEach(match => {
          if (!this.bID.isSolid(match.tile)) {
            return;
          }

          if (entity.yv > 0) {
            if (entity.y + entity.h > match.y1) {
              entity.y = match.y1 - entity.h;
              entity.yv = 0;
              //entity.ya = 0;
              entity.jump.canJump = true
            }
          } else if (entity.yv < 0) {
            if (entity.y < match.y2) {
              entity.y = match.y2;
              entity.yv = 0
            }
          }
        });
      }

      canStayOn(x, y, w, h) {
        const matches = this.tileResolver.searchByRange(x, x + w, y, y+ h);
        let possible = true
        matches.forEach(match => {
          if (match.tile != 3) {
            possible = false
          }
        })
        return possible
      }
    }
