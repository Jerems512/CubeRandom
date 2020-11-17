var a = document.getElementById("b");
var d = 0;
var goRun = true;
var countCarre = document.getElementById("carreRestant");
var affichageLvl = document.getElementById('affichageLvl');
var affiTimer = document.getElementById('t');
var indexTimer;
var t;
var afPrecision = document.getElementById('afPrecision');

var timer = () => { 
    affiTimer.innerHTML = `Temps restant : ${--indexTimer}`;
    if (indexTimer === 0) {
        if (accesLvl(1) - index !== 0) {
            end(3); // GAME OVER !
        }
    }
}

a.addEventListener('mousedown', function(){
    console.log(d++);
})


document.getElementById('btn').addEventListener('mousedown',() => {
    if(goRun) {
        goRun = false;
        run();
    }
});

var index = 0; // compteur de carré détruit


class Carre {
    constructor(id) {
        this.element = document.getElementById(id),
        this.depart_top = 300,
        this.depart_left = 300,
        this.event = this.element.addEventListener('mousedown', () => { 
            this.element.style.display = "none";
            clearInterval(this.interval);
            index++;
            countCarre.textContent = `${accesLvl(1) - index} / ${accesLvl(1)}`;
            if(index === accesLvl(1)) {
                end(2); // passe au niveau suivant
            }
        }),
        this.level = 1,
        this.pxTotal = 10 + (10 * 0.3 * this.level);

    }

    move(top, left) {
        this.depart_top += top;
        this.depart_left += left;
        this.element.style.top = `${this.depart_top}px`;
        this.element.style.left = `${this.depart_left}px`;
        if(this.depart_top >= 750 || this.depart_left >= 750 || this.depart_top < 0 || this.depart_left < 0) {
            if (this.depart_top > 750) {
                this.depart_top = 750;
            } else if(this.depart_top < 0) {
                this.depart_top = 0;
            }
            if(this.depart_left > 750) {
                this.depart_left = 750;
            } else if(this.depart_left < 0) {
                this.depart_left = 0;
            }
            clearInterval(this.interval);
            //console.log(this.pos); // test
            this.sensQuart();  
        }
    }
    
    
    polePosition() { // verifie la possibilité du polePosition ( sens vers lequel doit aller le carré )

        function getRandomInt(max) { 
            return Math.floor(Math.random() * Math.floor(max)); 
        }

        function coinBord(depart, a, b) { 
            if(depart >= 750) {
                return a; // vérifie un coin
            } else if(depart <= 0) {
                return b; // vérifie un coin
            }
            var tab = [a, b]; 
            return tab[getRandomInt(1)]; // renvoie vers un sens possible aléatoirement
        }
        
        var verifPos = (pos) => { // vérifie chaque coin et bord
            if(this.depart_top <= 0 && (pos === 3 || pos === 0)) { // carré en haut | ^
                return coinBord(this.depart_left, 2, 1);

            } else if(this.depart_top >= 750 && (pos === 1 || pos === 2)) { // carré en bas | v
                return coinBord(this.depart_left, 3, 0);

            } else if(this.depart_left <= 0 && (pos === 2 || pos === 3)) { // carré à gauche | < ---
                return coinBord(this.depart_top, 0, 1);

            } else if(this.depart_left >= 750 && (pos === 0 || pos === 1)) { // carré à droite | --- >
                return coinBord(this.depart_top, 3, 2);

            } else {
                return pos;
            }
        }
        
        return verifPos(getRandomInt(4));
        
    }

    sensQuart() { // place en positif ou négatif TOP et LEFT suivant POS et leur assigne un nombre suivant pxTotal
        this.pos = this.polePosition();
        var getRandom = () => {
            return Math.round(Math.random()*10); // retourne un nombre entre 0 et pxTotal
        }
        var top = getRandom();
        var left = 10 - top;

        if (this.pos === 3 || this.pos === 0) {
            top = top * -1;
        }
        if(this.pos === 3 || this.pos === 2) {
            left = left * -1;
        }
        this.interval = setInterval(() => {this.move(top, left);}, (60-(accesLvl(1)*1.5)));

    }

    stopInterval() {
        clearInterval(this.interval);
    }

}

// closure level
function closLvl() {
    var level = 1;
    return (nb) => {
        if(nb === 1) {
            return level;
        } else if(nb === 2) {
            return ++level;
        } else if(nb === 3) {
            return level = 1;
        }
    }
}

var accesLvl = closLvl();

// closure compteur carré détruit
function closCarre() {
    var compteur = 0;
    return (bool) => {
        if (bool) {
            return ++compteur;
        } else {
            compteur = 0;
        }
    }
}


function removeCarre() {
    for(let i = 0; i < tabCarre.length; i++) {
        a.removeChild(document.getElementById(`${i}`));
        tabCarre[i].stopInterval();
    }
}

function creaEl(id) {
    let el = document.createElement('div');
    el.setAttribute('id',`${id}`)
    el.setAttribute('class', 'carre');
    a.appendChild(el);
}

function reinitialiser() {
    removeCarre();
    tabCarre = [];
}

function run() {
    if (!tabCarre[0]) {
        affichageLvl.innerHTML = `Level ${accesLvl(1)}`;
    }
    var nbCarre = accesLvl(1); // recupération du level
    for(let i = 0; i< nbCarre; i++) {
        creaEl(i);
        var c = new Carre(`${i}`)
        tabCarre.push(c)
        c.sensQuart();
    }
    countCarre.textContent = `${accesLvl(1) - index} / ${accesLvl(1)}`;
    indexTimer = 30;
    t = setInterval(timer, 1000);
}

function precision() {
    return Math.round(100 / (d / index));
}


function end(nb) {
    reinitialiser()
    clearInterval(t);
    afPrecision.innerHTML = `Précision : ${precision()}%`;
    index = d = 0;
    goRun = true;
    affichageLvl.innerHTML = `Level ${accesLvl(nb)}`;
    affiTimer.innerHTML = "Temps restant : 30"
} 

var tabCarre = [];





  