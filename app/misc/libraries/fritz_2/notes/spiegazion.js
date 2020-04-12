// al cahnged...
// al ga la Frame, al cambia etweder par la pusizion o par la sprite
// nal update al fa return changed
// nal getSprite al controla i fiöi, sa i gan _posChanged e i gan an buffer, return buffer
// altriment ciama getSprite
// tö via al cahnged noma dopu al getSprite(al la fa al parent)

// Block al ga [x, y, w, h] e funzion par al moa [setPos, setSize, setRight, left, bottom]

// Frame al ga [xm, ym, cahnged(_posChanged)] e funzion cuma [update, getSprite, onKey, onMouse]
// glien li robi in cümün tra entity e layer
// al ga xm e ym par getMouse par calcula la pusizion

// Body al ga [xv, xa, xd, movingFor] e funnzion [setVel, setDrag, fixedUpdate => fisica] cun flag [autoMove]
// al ga la fisica e muiment

// Entity al ga [spriteDir, spriteAction, spriteFrame, cahnged(_spriteChanged)] e [getSprite]
// Le tüt par li sprite

// Context al ga getContext('2d') e funzion par disegna in modu plü semplice
// al ten li funzion par disegana
// al ottimizza la image (rImage)

// Canvas al ga al ver [xm, ym] e al ga un Context sa le an buffer
// sa ctx al pünta a un altru canvas le an livel sota (recursion)
// al dupera multiply par meta li cordinadi e grandezzi apost
// forsi al ga volarof naltra clas car an buffer (cun multiply ma miga na canvas?)


// Layer al ga dai children e al preSprite par met al ctx sa al ga miga al buffer
// SpriteLayer updaita tüc i childre, fixedUpdate da sa moa e collision

// Changed le la flag ca la dis ca al layer le cambiu
// sa al ven ciamu getSprite al ven ciamu al vol di ca an fradel le cambiu
// e al pa la da ricostrüi tüt
// sa al layer al ga miga an layer la da ridisegna tüc i fiöi sul ctx dal pa
// sa al ga an buffer e le miga cambiu al po da al buffer al pa
// sa al ga an buffer e le cambiu la da ridisegna tüc i fiöi e da al buffer al pa
// changed al po esa resettu noma dopu ave ciamu al getSprite, dopu ave disegnu tüt

// App.js al crea al Timer, al sculta par resize

//Helper.js al ga al preloadCounter, loadImage, loadJSON, capitalize, getColor, addDefaultOptions

// cuma fa par layers...
// Layers al ga tanct layer in cui al met i fiöi, al ga an map ca al ga dis a che livel ca le
// al ga an forEach ca al fa pasa tüt

// TileGame al ga chunkWidth/height, tileWidth, chunks e miga collisionTable,
// li sprie gline in dali sprites
// al ga anca funzion cuma getTileAt, collideMap, loadChunkAt

// Chuk le an canvas ca al buffera tüc i diseign, al cambia noma i necesari
// i blöc cun animazion le amo da decida sa i salva nal chunk o nal TileGame
// parchi i gan an sfondo trasparent?

// temp
// dove vegnial salvu i blöc cun animazion?

// ca i vegnian ciamai da default nal realFun o da quela dal utente

// funzion par disegnà cun an oggetto? tipu an per default po an args?
// image(img, x, y, w, h, {} || '')

// i layer sota la camera ien noma dai viewport!!
// al volt di ca quili cuurdinadi glien al löc nala mappa, al punto da vista
// par quest nal i al cuntrarti in input la da esa +/-
// nal disegnà sarof sempri da cuntrulà sa le an viewport par al boundry?

// creà tüc i _draw nurmai
// estenda an canvas e al agiüngia cuma layer larof da già funziunà
// scerna la pusizion sül schermo
// child.x||y le la pos e sprite.x||y le al offset

// fill, stroke, strokeWeight, rect, image, text, background
// multiply

// MIDDLEWERESS
// Frame
//    fixedUpdate.post => check fot poschanged

// Body
//    fixedUpdate.post => movingFor

// Layer
//    fixedUpdate.post => check fot poschanged
//    getSprite.pre => set this.sprite to parentSprite

// SpriteLayer
//    update.post => call changed to all children and get if updated
//    fixedUpdate.post => update child phisics
//    getSprite.post => if ret !== false => get sprite of children and set them to changed = false

// TileGame
//    pre par tüt par i chunk e _autoLoadChunks (update: miga _autoLoadChunks)
