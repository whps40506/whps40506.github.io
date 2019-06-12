// 定義玩家的移動鍵
var Keyboard = {
    UP: 68,     //W-上
    DOWN: 65,   //S-下
    LEFT: 87,   //A-左
    RIGHT: 83,  //D-右
    ACCEL: 74,  //J-加速
    SS: 82,     //R-無敵

    up: false,
    down: false,
    left: false,
    right: false,
    accel: false,
    ss : false,
};

// 遊戲狀態
var Game = {
    playing: true,
    over: false,
    stageClear: null,
    level: 0,
    setss:false,
};
function chose() {

    Game.stageClear++;
    if(Game.stageClear === 3)
    {
        Game.stageClear = 0;
    }
    document.getElementById("diff").innerHTML = Game.stageClear;
    localStorage.setItem("stageClear", Game.stageClear);
}

var timer_s = 0;
function timeCount() {
    if (!Game.over && Game.playing)
    {
        document.getElementById("timer").innerText = timer_s;
        timer_s++;
    }
    setTimeout("timeCount()", 1000);
}

var bgm = document.getElementById("bgm");
var volControl = document.getElementById("volControl");
volControl.addEventListener('change', setVolume, false);
var music = ["bgm.mp3", "bgm2.mp3", "bgm3.mp3"];

function setVolume() {
    bgm.volume = volControl.value;
}
function load() {
    // 判斷瀏覽器是否為Chrome
    if(!navigator.userAgent.match("Chrome")){
        alert("強烈建議以Chrome瀏覽器開啟此網頁！\n避免發生錯誤。");
    }
    // 禁止右鍵
    document.oncontextmenu = function () { return false; }
}

function intro() {
    var obj = document.getElementById("gameIntro");
    obj.style.zIndex = 15;
}

function exitIntro() {
    var obj = document.getElementById("gameIntro");
    obj.style.zIndex = 5;
}

function start() {

    document.getElementById("differ").disabled = true;
    var obj1 = document.getElementById("menu");
    obj1.style.opacity = 0;
    obj1.style.zIndex = -5;
    var obj2 = document.getElementById("gameIntro");
    obj2.style.opacity = 0;
    obj2.style.zIndex = -5;

    if (localStorage.getItem("stageClear"))
    {
        Game.stageClear = Number(localStorage.getItem("stageClear"));
    }
    else
    {
        localStorage.stageClear = 0;
        Game.stageClear = 0;
    }

    if (Game.stageClear >= 2)
    {
        player.hp = 100;
        enemy.hp = 200;
        Game.level = 2;
    }
    else if (Game.stageClear >= 1)
    {
        player.hp = 100;
        enemy.hp = 150;
        Game.level = 1;
    }
    else
    {
        player.hp = 100;
        enemy.hp = 100;
        Game.level = 0;
    }
    document.getElementById("HP").innerText = "HP:" + player.hp;
    document.getElementById("enemy_HP").innerText = "EnemyHP:" + enemy.hp;
    player.hpRate = player.hp / 50;
    enemy.hpRate = enemy.hp / 940;

    bgm.src = music[Game.level];

    timeCount();
    setTimeout("run()", 100);
    setTimeout(function () { enemy_moveControl(); bgm.play(); }, 300);
}

function pause() {
    if (Game.playing)
    {
        Game.playing = false;
        document.getElementById("pause").setAttribute("value", "繼續遊戲");
    }
    else
    {
        Game.playing = true;
        document.getElementById("pause").setAttribute("value", "暫停");
        enemy_moveControl();
    }
}

function exit() {
    Game.playing = false;
    location.reload();
}

// 玩家
var player = {
    x: 200,
    y: 600,
    hp: null,
    hpRate: null,
    speed: 4,
    map_data: []
};

// 電腦角色
var enemy = {
    x: 375,
    y: 250,
    hp: null,
    hpRate: null,
    vx: 0,
    vy: 0,
    moving: false,
    speed: 4,
    map_data: []
};

//粉
var Queue = {
    ammo: [],
    initAmmo: function (maxAmmoCount)
    {
        // 初始化陣列大小,maxAmmoCount限制畫面上子彈的數量限制
        maxAmmoCount = maxAmmoCount || 512;
        for (var i = 0; i < maxAmmoCount; i++)
        {
            Queue.ammo[i] = null;
        }
    },
    init: function ()
    {
        Queue.initAmmo();
    },
    over: function ()
    {
        for (var i = 0; i < 512; i++)
        {
            if (Queue.ammo[i] != null)
                Queue.ammo[i].die = true;
        }
    }
};
Queue.init();
//黃
var Queue2 = {
    ammo: [],
    initAmmo: function (maxAmmoCount)
    {
        // 初始化陣列大小,maxAmmoCount限制畫面上子彈的數量限制
        maxAmmoCount = maxAmmoCount || 512;
        for (var i = 0; i < maxAmmoCount; i++)
        {
            Queue2.ammo[i] = null;
        }
    },
    init: function ()
    {
        Queue2.initAmmo();
    },
    over: function ()
    {
        for (var i = 0; i < 512; i++)
        {
            if (Queue2.ammo[i] != null)
                Queue2.ammo[i].die = true;
        }
    }
};
Queue2.init();
//藍
var Queue3 = {
    ammo: [],
    initAmmo: function (maxAmmoCount)
    {
        // 初始化陣列大小,maxAmmoCount限制畫面上子彈的數量限制
        maxAmmoCount = maxAmmoCount || 512;
        for (var i = 0; i < maxAmmoCount; i++)
        {
            Queue3.ammo[i] = null;
        }
    },
    init: function ()
    {
        Queue3.initAmmo();
    },
    over: function ()
    {
        for (var i = 0; i < 512; i++)
        {
            if (Queue3.ammo[i] != null)
                Queue3.ammo[i].die = true;
        }
    }
};
Queue3.init();

// 用來管理玩家子彈的陣列
var playerQueue = {
    ammo: [],
    initPlayerAmmo: function (maxAmmoCount)
    {
        // 初始化陣列大小,maxAmmoCount限制畫面上子彈的數量限制
        maxAmmoCount = maxAmmoCount || 30;
        for (var i = 0; i < maxAmmoCount; i++)
        {
            playerQueue.ammo[i] = null;
        }
    },
    init: function ()
    {
        playerQueue.initPlayerAmmo();
    }
};
playerQueue.init();


/* 碰撞檢測矩陣
 * 玩家受到傷害 */
var Matrix = {

    player: [],  //玩家形状
    ammo: [],   //彈幕形状
    stage: [],  //舞台MAP
    hited: [],  //碰撞位置

    // 重置舞台
    init: function ()
    {
        var i, n = 800 * 940;
        for (i = 0; i < n; i++)
        {
            Matrix.stage[i] = 0;
        }
    },

    /** 繪製彈幕
     * @param  {float} x
     * @param  {float} y
     * @param  {int}   w
     * @param  {int}   h   */
    drawAmmo: function (x, y, w, h) {
        w = w ;
        h = h ;
        x = parseInt(x);
        y = parseInt(y);
        var i = 0,
            j = 0,
            k = 0,
            l = 0,
            m = 0,
            n = 0;
        for (i = 0; i < w; i++)
        {
            for (j = 0; j < h; j++)
            {
                m = parseInt(j * w + i);
                if (Matrix.ammo[m] > 0)
                {
                    n = parseInt((j + y) * 800 + (i + x));
                    Matrix.stage[n] = 1;
                }
            }
        }
    },

    /** 繪製玩家
     * @param  {float} x
     * @param  {float} y
     * @param  {int}   w
     * @param  {int}   h    */
    drawplayer: function (x, y, w, h) {
        w = w || 80;
        h = h || 80;
        x = parseInt(x);
        y = parseInt(y);
        var i = 0,
            j = 0,
            k = 0,
            l = 0,
            m = 0,
            n = 0,
            hit = false;
        Matrix.hited.length = 0;
        for (i = 0; i < w; i++)
        {
            for (j = 0; j < h; j++)
            {
                m = parseInt(j * w + i);
                if (Matrix.player[m] > 0)
                {
                    n = parseInt((j + y) * 800 + (i + x));
                    if (Matrix.stage[n] === 1)
                    {
                        Matrix.stage[n] = 2;
                        hit = true;
                        Matrix.hited.push(n);
                    }
                    else
                    {
                        Matrix.stage[n] = 3;
                    }
                }
            }
        }
        return hit;
    }
}; //這裡是Matrix的下括弧---


/* 碰撞減色矩陣
 * 電腦角色受到傷害 */
var Matrix_enemy = {

    enemy: [],  //Boss形狀
    ammo: [],   //子彈形狀
    stage: [],  //舞台MAP
    hited: [],  //碰撞位置

    // 重置舞台
    init: function ()
    {
        var i, n = 800 * 940;
        for (i = 0; i < n; i++)
        {
            Matrix_enemy.stage[i] = 0;
        }
    },

    /** 繪製子彈
     * @param  {float} x
     * @param  {float} y
     * @param  {int}   w
     * @param  {int}   h   */
    drawAmmo: function (x, y, w, h) {
        w = w || 32;
        h = h || 32;
        x = parseInt(x);
        y = parseInt(y);
        var i = 0,
            j = 0,
            k = 0,
            l = 0,
            m = 0,
            n = 0;
        for (i = 0; i < w; i++)
        {
            for (j = 0; j < h; j++)
            {
                m = parseInt(j * w + i);
                if (Matrix_enemy.ammo[m] > 0)
                {
                    n = parseInt((j + y) * 800 + (i + x));
                    Matrix_enemy.stage[n] = 1;
                }
            }
        }
    },

    /** 繪製Boss
     * @param  {float} x
     * @param  {float} y
     * @param  {int}   w
     * @param  {int}   h    */
    drawEnemy: function (x, y, w, h) {
        w = w || 50;
        h = h || 50;
        x = parseInt(x);
        y = parseInt(y);
        var i = 0,
            j = 0,
            k = 0,
            l = 0,
            m = 0,
            n = 0,
            hit = false;
        Matrix_enemy.hited.length = 0;
        for (i = 0; i < w; i++)
        {
            for (j = 0; j < h; j++)
            {
                m = parseInt(j * w + i);
                if (Matrix_enemy.enemy[m] > 0)
                {
                    n = parseInt((j + y) * 800 + (i + x));
                    if (Matrix_enemy.stage[n] === 1)
                    {
                        Matrix_enemy.stage[n] = 2;
                        hit = true;
                        Matrix_enemy.hited.push(n);
                    } else {
                        Matrix_enemy.stage[n] = 3;
                    }
                }
            }
        }
        return hit;
    }
}; //這裡是Matrix_enemy的下括弧---

Matrix.init();
Matrix_enemy.init();

Vect = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

/** playerAmmo 玩家的子彈 */
playerAmmo = function (x, y, vx, vy, ax, ay) {
    // 子彈橫坐標原點為player.x + (玩家直徑-子彈直徑)/2
    this.x = x;      //橫坐標
    this.y = y + 32;  //縱坐標
    this.vx = 0;  //橫向速度
    this.vy = vy || -30;  //縱向速度
    this.ax = ax || 0;  //橫向加速度
    this.ay = ay || 0;  //縱向加速度
    this.die = false;   //子彈是否已消亡
    this.sx = x;
    this.sy = y;
};

// 將子彈加入彈幕陣列
playerAmmo.prototype.queue = function () {
    // 從頭開始搜尋陣列，發現空位時填入陣列
    var i = 0;
    while (i < playerQueue.ammo.length)
    {
        // 空位的定義是null或被標記為已消亡的子彈
        if (playerQueue.ammo[i] == null || playerQueue.ammo[i].die)
        {
            playerQueue.ammo[i] = this;
            return true;
        }
        i++;
    }
    return false;
};

// 描述子彈移動的方法
playerAmmo.prototype.move = function () {
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;

    // 當子彈超出畫布邊界時消亡
    if (this.x < -60) { this.die = true; }
    if (this.y < 55) { this.die = true; }
    if (this.x > 800) { this.die = true; }
    if (this.y > 940) { this.die = true; }
    if (this.vx === 0 && this.vy === 0 && this.ax === 0 && this.ay === 0) {
        this.die = true;
    }
    return this;
};

/** 加速度恒定的子弹(單一子彈物件)
 * @param {float} x
 * @param {float} y
 * @param {float} vx
 * @param {float} vy
 * @param {float} ax
 * @param {float} ay    */
DirectAmmo = function (x, y, vx, vy, ax, ay) {
    this.x = x || 400;  //橫坐標
    this.y = y || 300;  //縱坐標
    this.vx = vx || 2;  //橫向速度
    this.vy = vy || 2;  //縱向速度
    this.ax = ax || 0;  //橫向加速度
    this.ay = ay || 0;  //縱向加速度
    this.die = false;   //子彈是否已消亡
    this.sx = x;
    this.sy = y;
};

// 將子彈加入彈幕陣列
DirectAmmo.prototype.queue = function () {
    // 從頭開始搜尋陣列，發現空位時填入陣列
    var i = 0;
    while (i < Queue.ammo.length)
    {
        // 空位的定義是null或被標記為已消亡的子彈
        if (Queue.ammo[i] == null || Queue.ammo[i].die)
        {
            Queue.ammo[i] = this;
            return true;
        }
        i++;
    }
    return false;
};

// 描述子彈移動的方法
DirectAmmo.prototype.move = function () {
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;

    // 當子彈超出畫布邊界時消亡
    if (this.x < -60) this.die = true;
    if (this.y < 45)  this.die = true;
    if (this.x > 800) this.die = true;
    if (this.y > 940) this.die = true;
    if (this.vx === 0 && this.vy === 0 && this.ax === 0 && this.ay === 0)
    {
        this.die = true;
    }
    return this;
};

/** 同心圓擴散的彈幕(一組環狀散開的DirectAmmo)
 * @param {float} x
 * @param {float} y
 * @param {int}   count
 * @param {float} speed
 * @param {float} ax
 * @param {float} ay       */
RoundDirectAmmo = function (x, y, count, speed, offset, ax, ay) {
    x = x || 400;
    y = y || 300;
    count = count || 24; //同心圓子彈個數
    speed = speed || 3;  //發散速度
    ax = ax || 0;
    ay = ay || 0;
    offset = offset || 0.000000001;
    var step = Math.PI * 2 / count;
    var ammos = [];
    var i, vx, vy, da;
    for (i = 0; i < count; i++)
    {
        vx = speed * Math.cos(offset);
        vy = speed * Math.sin(offset);
        da = new DirectAmmo(x, y, vx, vy, ax, ay);
        offset += step;
        ammos[ammos.length] = da;
    }
    this.ammos = ammos;
};

// 將子彈加入彈幕陣列
RoundDirectAmmo.prototype.queue = function () {
    var i = 0, j = 0;
    while (i < Queue.ammo.length && j < this.ammos.length)
    {
        if (Queue.ammo[i] == null || Queue.ammo[i].die)
        {
            Queue.ammo[i] = this.ammos[j];
            j++;
        }
        i++;
    }
    return this;
};

RoundDirectAmmo.prototype.queue2 = function () {
    var i = 0, j = 0;
    while (i < Queue2.ammo.length && j < this.ammos.length)
    {
        if (Queue2.ammo[i] == null || Queue2.ammo[i].die)
        {
            Queue2.ammo[i] = this.ammos[j];
            j++;
        }
        i++;
    }
    return this;
};

RoundDirectAmmo.prototype.queue3 = function () {
    var i = 0, j = 0;
    while (i < Queue3.ammo.length && j < this.ammos.length)
    {
        if (Queue3.ammo[i] == null || Queue3.ammo[i].die)
        {
            Queue3.ammo[i] = this.ammos[j];
            j++;
        }
        i++;
    }
    return this;
};


var cvs_player,	//玩家
    ctx_player,

    cvs_playerAmmo,  //玩家子彈
    ctx_playerAmmo,

    cvs_enemy,
    ctx_enemy,

    cvs_ammo,	//子彈
    ctx_ammo,

    cvs,	//遊戲舞台
    ctx,


// 繪製遊戲舞台
    cvs = document.getElementById('stage');
    cvs.height = 940;
    cvs.width = 800;
    ctx = cvs.getContext('2d');
    ctx.fillStyle = '#000000';  //黑色
    ctx.fillRect(0, 0, 800, 940);


// 繪製玩家
    cvs_player = document.getElementById('player');
    var imgset = new Image();
    imgset.src = "in.png";
imgset.onload = function()
{
    ctx_player = cvs_player.getContext('2d');
    ctx_player.drawImage(imgset, 0, 0);

    var player_data = ctx_player.getImageData(0, 0,80,80).data;
    for (var i = 0; i < 80 * 80; i++)
    {
        var dot = i * 4;
        if (player_data[dot] > 0 || player_data[dot + 1] > 0 || player_data[dot + 2] > 0)
        {
            Matrix.player[i] = 1;
        }
        else
        {
            Matrix.player[i] = 0;
        }
    }
};
// boss 繪製
cvs_enemy = document.getElementById('enemy');
cvs_enemy.height = 50;  //高度
cvs_enemy.width = 50;   //寬度
ctx_enemy = cvs_enemy.getContext('2d');
ctx_enemy.fillStyle = 'rgba(185, 123, 182, 1)';
ctx_enemy.beginPath();
ctx_enemy.arc(25, 25, 25, 0, Math.PI * 2, true); //半徑25像素
ctx_enemy.closePath();
ctx_enemy.fill();
var enemy_data = ctx_enemy.getImageData(0, 0, 32, 32).data;
for (var i = 0; i < 32 * 32; i++)
{
    var dot = i * 4;
    if (enemy_data[dot] > 0 || enemy_data[dot + 1] > 0 || enemy_data[dot + 2] > 0)
    {
        Matrix_enemy.enemy[i] = 1;
    }
    else
    {
        Matrix_enemy.enemy[i] = 0;
    }
}

/* Canvas繪圖語法
 * .beginPath() 開始路徑繪製
 * .closePath() 結束路徑繪製
 * .fill() 填滿路徑範圍
 * .arc(x, y, radius, startAngle, endAngle, antiClockwise)
 *  繪製弧形(圓心x座標, 圓心y座標, 弧形起始點, 弧形結束點, 順/逆時針)  */

// 繪製彈幕
cvs_ammo = document.getElementById('ammo');
cvs_ammo.height = 14;
cvs_ammo.width = 14;
ctx_ammo = cvs_ammo.getContext('2d');
ctx_ammo.fillStyle = 'rgba(35, 250, 214, 1)'; //藍
ctx_ammo.beginPath();
ctx_ammo.arc(7, 7, 7, 0, Math.PI * 2, true);
ctx_ammo.closePath();
ctx_ammo.fill();
var ammo_data = ctx_ammo.getImageData(0, 0, 14, 14).data;
for (var i = 0; i < 14 * 14; i++)
{
    var dot = i * 4;
    if (ammo_data[dot] > 0 || ammo_data[dot + 1] > 0 || ammo_data[dot + 2] > 0)
    {
        Matrix.ammo[i] = 1;
    }
    else
    {
        Matrix.ammo[i] = 0;
    }
} //彈幕繪製完成

// 繪製彈幕2
cvs_ammo2 = document.getElementById('ammo2');
cvs_ammo2.height = 18;
cvs_ammo2.width = 18;
ctx_ammo2 = cvs_ammo2.getContext('2d');
ctx_ammo2.fillStyle = 'rgba(255, 255, 0, 1)'; //黃色
ctx_ammo2.beginPath();
ctx_ammo2.arc(9, 9, 9, 0, Math.PI * 2, true);
ctx_ammo2.closePath();
ctx_ammo2.fill();
var ammo2_data = ctx_ammo2.getImageData(0, 0, 18, 18).data;
for (var i = 0; i < 18 * 18; i++)
{
    var dot = i * 4;
    if (ammo2_data[dot] > 0 || ammo2_data[dot + 1] > 0 || ammo2_data[dot + 2] > 0)
    {
        Matrix.ammo[i] = 1;
    }
    else
    {
        Matrix.ammo[i] = 0;
    }
} //彈幕2繪製完成

// 繪製彈幕3
cvs_ammo3 = document.getElementById('ammo3');
cvs_ammo3.height = 60;
cvs_ammo3.width = 60;
ctx_ammo3 = cvs_ammo3.getContext('2d');
ctx_ammo3.fillStyle = 'rgba(32, 252, 51, 0.7)'; //大顆透明
ctx_ammo3.beginPath();
ctx_ammo3.arc(30, 30, 30, 0, Math.PI * 2, true);
ctx_ammo3.closePath();
ctx_ammo3.fill();
var ammo3_data = ctx_ammo3.getImageData(0, 0, 60, 60).data;
for (var i = 0; i < 60 * 60; i++)
{
    var dot = i * 4;
    if (ammo3_data[dot] > 0 || ammo3_data[dot + 1] > 0 || ammo3_data[dot + 2] > 0)
    {
        Matrix.ammo[i] = 1;
    }
    else
    {
        Matrix.ammo[i] = 0;
    }
} //彈幕3繪製完成


// 繪製玩家子彈
cvs_playerAmmo = document.getElementById('playerAmmo');
cvs_playerAmmo.height = 32;
cvs_playerAmmo.width = 32;
ctx_playerAmmo = cvs_playerAmmo.getContext('2d');
ctx_playerAmmo.fillStyle = 'rgba(62, 202, 19, 0.5)';
ctx_playerAmmo.beginPath();
ctx_playerAmmo.arc(16, 16, 16, 0, Math.PI * 2, true);
ctx_playerAmmo.closePath();
ctx_playerAmmo.fill();
var playerAmmo_data = ctx_playerAmmo.getImageData(0, 0, 32, 32).data;
for (var i = 0; i < 32 * 32; i++) {
    var dot = i * 4;
    if (playerAmmo_data[dot] > 0 || playerAmmo_data[dot + 1] > 0 || playerAmmo_data[dot + 2] > 0)
    {
        Matrix_enemy.ammo[i] = 1;
    }
    else
    {
        Matrix_enemy.ammo[i] = 0;
    }
} //子彈繪製完成


window.onkeydown = function (e) {
    switch (e.keyCode) {
        case Keyboard.UP:
            Keyboard.up = true;
            break;
        case Keyboard.DOWN:
            Keyboard.down = true;
            break;
        case Keyboard.LEFT:
            Keyboard.left = true;
            break;
        case Keyboard.RIGHT:
            Keyboard.right = true;
            break;
        case Keyboard.ACCEL:
            Keyboard.accel = true;
            break;
        case Keyboard.SS:
            Keyboard.ss = true;
            break;
        default:
            break;
    }
};

window.onkeyup = function (e) {
    switch (e.keyCode) {
        case Keyboard.UP:
            Keyboard.up = false;
            break;
        case Keyboard.DOWN:
            Keyboard.down = false;
            break;
        case Keyboard.LEFT:
            Keyboard.left = false;
            break;
        case Keyboard.RIGHT:
            Keyboard.right = false;
            break;
        case Keyboard.ACCEL:
            Keyboard.accel = false;
            break;
        case Keyboard.SS:
            Keyboard.ss = true;
            break;
        default:
            return false;
    }
};
var countdownnumber = 500;
var countdownid;

// 主程式
function run() {

    if (!Game.playing)
    {
        setTimeout(function () { run() }, 20);
        return;
    }
    /* 玩家移動*/
    if (Keyboard.accel)
    {
        player.speed = 8;
    }
    else
    {
        player.speed = 4;
    }
    if (Keyboard.up && player.y > 0)
    {
        player.y -= player.speed;
    }
    if (Keyboard.down && player.y < 940 - 80)
    {
        player.y += player.speed;
    }
    if (Keyboard.left && player.x > 0)
    {
        player.x -= player.speed;
    }
    if (Keyboard.right && player.x < 800 - 80)
    {
        player.x += player.speed;
    }

    Matrix.init();
    Matrix_enemy.init();

    // 在stage畫布中繪製實際遊戲舞台
    if(Game.stageClear === 0)
		ctx.fillStyle = '#ffffff';  //white
	else if(Game.stageClear === 1)
		ctx.fillStyle = '#000000';  //黑色
    else
        ctx.fillStyle = '#ff9e9e';
    ctx.fillRect(0, 0, 800, 940);
    ctx.drawImage(cvs_player, player.x, player.y);
    ctx.drawImage(cvs_enemy, enemy.x, enemy.y);
    // 玩家血條
    ctx.fillStyle = 'rgba(255, 0, 0, 1)';
    ctx.fillRect(player.x + 15, player.y + 20,10 , (player.hp / player.hpRate));
    ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
    ctx.fillRect(player.x + 15, player.y + 20, 10, 50);
    // BOSS血條
    ctx.fillStyle = 'rgba(153, 51, 255, 0.9)'
    ctx.fillRect(5, 0, 35,(enemy.hp / enemy.hpRate));
    ctx.fillStyle = 'rgba(153, 51, 255, 0.5)'
    ctx.fillRect(5, 0, 35, 940);


    var i;
    for (i = 0; i < Queue.ammo.length; i++)
    {
        if (Queue.ammo[i] != null && !Queue.ammo[i].die)
        {
            Queue.ammo[i].move();
            ctx.drawImage(cvs_ammo, Queue.ammo[i].x, Queue.ammo[i].y);
            Matrix.drawAmmo(Queue.ammo[i].x, Queue.ammo[i].y, 12, 12);
        }
    }
    for (i = 0; i < Queue2.ammo.length; i++)
    {
        if (Queue2.ammo[i] != null && !Queue2.ammo[i].die)
        {
            Queue2.ammo[i].move();
            ctx.drawImage(cvs_ammo2, Queue2.ammo[i].x, Queue2.ammo[i].y);
            Matrix.drawAmmo(Queue2.ammo[i].x, Queue2.ammo[i].y, 18, 18);
        }
    }
    for (i = 0; i < Queue3.ammo.length; i++)
    {
        if (Queue3.ammo[i] != null && !Queue3.ammo[i].die)
        {
            Queue3.ammo[i].move();
            ctx.drawImage(cvs_ammo3, Queue3.ammo[i].x, Queue3.ammo[i].y);
            Matrix.drawAmmo(Queue3.ammo[i].x, Queue3.ammo[i].y, 60, 60);
        }
    }
    for (i = 0; i < playerQueue.ammo.length; i++)
    {
        if (playerQueue.ammo[i] != null && !playerQueue.ammo[i].die)
        {
            playerQueue.ammo[i].move();
            ctx.drawImage(cvs_playerAmmo, playerQueue.ammo[i].x, playerQueue.ammo[i].y);
            Matrix_enemy.drawAmmo(playerQueue.ammo[i].x, playerQueue.ammo[i].y);
        }
    }


    // 判定電腦角色受到傷害
    if (Matrix_enemy.drawEnemy(enemy.x, enemy.y))
    {
        // 損血並即時更新血量
        enemy.hp--;
        document.getElementById("enemy_HP").innerText = "EnemyHP:" + enemy.hp;
        // 血量歸零時結束遊戲
        if (enemy.hp <= 0)
        {
            Game.over = true;
            Game.playing = false;
            bgm.pause();
            document.getElementById("pause").disabled = true;
            var cvs_win = document.getElementById('gameover_win');
            cvs_win.height = 940;
            cvs_win.width = 1000;
            var ctx_win = cvs_win.getContext('2d');
            var img_win = new Image();
            img_win.onload = function ()
            {
                ctx_win.drawImage(img_win, 0, 0);
            };
            img_win.src = 'Win.png';
            cvs_win.style.zIndex = 15;

            Game.stageClear++;
            localStorage.setItem("stageClear", Game.stageClear);
        }
    }
    //無敵判斷
    if(Keyboard.ss)
    {
        Game.setss = true;
        countdownfunc();
    }
    function countdownfunc(){

        var x=document.getElementById("countdown");
        x.innerHTML= countdownnumber/100;
        if (countdownnumber === 0)
        {
            Game.setss = false;
            Keyboard.ss = false;
            clearTimeout(countdownid);
            document.getElementById("count").style.display = "none";
        }
        else
        {
            countdownnumber--;
            countdownid = window.setTimeout(countdownfunc,1000);
        }
    }

    // 碰撞發生時執行(傷害判定)
    if (Matrix.drawplayer(player.x, player.y) && (!Game.setss))
    {
        // 損血並即時更新血量
        player.hp--;
        document.getElementById("HP").innerText = "HP:" + player.hp;
        // 血量歸零時結束遊戲
        if (player.hp <= 0)
        {
            Game.over = true;
            Game.playing = false;
            bgm.pause();
            document.getElementById("pause").disabled = true;
            var cvs_lose = document.getElementById('gameover_lose');
            cvs_lose.height = 470;
            cvs_lose.width = 560;
            var ctx_lose = cvs_lose.getContext('2d');
            var img_lose = new Image();
            img_lose.src = "Lose.png";
            img_lose.onload = function () {
                ctx_lose.drawImage(this, 0, 0);
            };
            cvs_lose.style.zIndex = 15;

            Game.stageClear = 0;
            localStorage.setItem("stageClear", Game.stageClear);
        }
    }

    if (enemy.moving)
    {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;
    }
    setTimeout(function () { run() }, 20);
} //這裡是主程式run()的下括弧

// 玩家發射子彈
function player_shoot()
{
    if (Game.playing)
    {
        new playerAmmo(player.x + 60, player.y - 32).queue();
    }
    setTimeout(function () { player_shoot() }, 200);
}
player_shoot();

//boss
// 移動
function enemy_moveControl()
{
    if (!Game.playing) return;

    var x_dist, y_dist, dist;

    x_dist = Math.random() * 120 + 80;
    y_dist = Math.random() * 120 + 20;

    if (enemy.x <= 150)
    {
        if (Math.random() < 0.2) x_dist = -x_dist;
    }
    else if (enemy.x >= 600)
    {
        if (Math.random() < 0.8) x_dist = -x_dist;
    }
    else if (Math.random() < 0.5)
        x_dist = -x_dist;

    if (enemy.y <= 200)
    {
        if (Math.random() < 0.3) y_dist = -y_dist;
    }
    else if (Math.random() < 0.5)
        y_dist = -y_dist;


    if (enemy.x + x_dist < 150) x_dist =  Math.abs(x_dist);
    if (enemy.x + x_dist > 600) x_dist = -Math.abs(x_dist);
    if (enemy.y + y_dist < 200) y_dist =  Math.abs(y_dist);
    if (enemy.y + y_dist > 400) y_dist = -Math.abs(y_dist);

    dist = Math.pow(Math.pow(x_dist, 2) + Math.pow(y_dist, 2), 0.5);
    enemy.vx = x_dist * enemy.speed / dist;
    enemy.vy = y_dist * enemy.speed / dist;

    var time = dist * 20 / enemy.speed;
    var delay;

    if (Game.level === 0)
    {
        if (Math.random() < 0.3)
            delay = 1000;
        else if(Math.random() < 0.6)
            delay = 600;
		else
			delay = 2200;
    }
    else if (Game.level === 1)
    {
        if (Math.random() < 0.3)
            delay = 3000;
        else if(Math.random() < 0.6)
            delay = 700;
		else 
			delay=500;
    }
    else
    {
        if (timer_s <= 40)
        {
            if (Math.random() < 0.3)
                delay = 5000;
            else if(Math.random() < 0.6)
                delay = 400;
			else
				delay=3000;
        }
		else
		{
			if (Math.random() < 0.2)
                delay = 3000;
            else if(Math.random() < 0.5)
                delay = 400;
			else if(Math.random() < 0.7)
				delay=4000;
			else
				delay=5000;
		}
	
    }

    enemy.moving = true;
    setTimeout(function () { enemy.moving = false; enemy_atkControl(delay) }, time);
    setTimeout("enemy_moveControl()", time + delay);
}

// 攻擊
function enemy_atkControl(delay) {
    if (!enemy.moving)
    {
        switch (delay)
        {
            /* 以電腦角色的中心點為圓心施放同心圓彈幕
             * x,y的位移調整值為 電腦角色半徑-子彈半徑 */
            case 1000: //雙圓
                new RoundDirectAmmo(enemy.x + 16, enemy.y + 16, 30, 5).queue2();
                setTimeout(function () { new RoundDirectAmmo(enemy.x + 16, enemy.y + 16, 30, 5).queue2() }, 400);
                break;

            // 慢速泡泡
            case 500:
                new RoundDirectAmmo(enemy.x - 5, enemy.y - 5, 18, 3).queue3();
                break;

            // 高速泡泡
            case 400:
                new RoundDirectAmmo(enemy.x - 5, enemy.y - 5, 20, 8).queue3();
                break;

            // 大型黃色煙火
            case 4000:
                var x1 = Math.random() * 500 + 150,
                    y1 = Math.random() * 250 + 150,
                    x2 = Math.random() * 500 + 150,
                    y2 = Math.random() * 250 + 150,
                    x3 = Math.random() * 500 + 150,
                    y3 = Math.random() * 250 + 150;
                new RoundDirectAmmo(enemy.x + 16, enemy.y + 16, 36, 5).queue2();
                setTimeout(function () { new RoundDirectAmmo(enemy.x + 16, enemy.y + 16, 36, 5).queue2() }, 300);
                setTimeout(function () { new RoundDirectAmmo(x1, y1, 36, 5).queue2() }, 800);
                setTimeout(function () { new RoundDirectAmmo(x1, y1, 36, 5).queue2() }, 1100);
                setTimeout(function () { new RoundDirectAmmo(x2, y2, 36, 5).queue2() }, 1600);
                setTimeout(function () { new RoundDirectAmmo(x2, y2, 36, 5).queue2() }, 1900);
                setTimeout(function () { new RoundDirectAmmo(x3, y3, 36, 5).queue2() }, 2400);
                setTimeout(function () { new RoundDirectAmmo(x3, y3, 36, 5).queue2() }, 2700);
                break;

            // 櫻花
            case 5000:
                var offset = 0;
                for (var i = 0; i < 30; i++) {
					
                    setTimeout(function () { offset +=0.2; new RoundDirectAmmo(enemy.x + 18, enemy.y + 18, 18, 10, offset).queue() }, 150 * (i + 1));
					
                } 
                break;
            // 小型煙火
            case 2200:
                new RoundDirectAmmo(enemy.x + 16, enemy.y + 16, 12, 5).queue2();
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 400);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 800);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 1200);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 1600);
                break;

            // 小型高速泡泡
            case 600:
                new RoundDirectAmmo(enemy.x - 5, enemy.y - 5, 16, 8).queue3();
                break;

            // 密集煙火
            case 3000:
                new RoundDirectAmmo(enemy.x + 16, enemy.y + 16, 18, 7).queue2();
                //setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 400);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 400);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 400);
                //setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 800);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 800);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 800);
                //setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 1200);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 1200);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 1200);
                //setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 1600);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 1600);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 1600);
                //setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 2000);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 2000);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 2000);
                //setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 2400);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 2400);
                setTimeout(function () { new RoundDirectAmmo(Math.random() * 500 + 150, Math.random() * 300 + 150, 12, 5).queue2() }, 2400);
                break;

            // 櫻花花環
            case 700:
                new RoundDirectAmmo(enemy.x + 18, enemy.y + 18, 36, 9).queue();
                setTimeout(function () { new RoundDirectAmmo(enemy.x + 18, enemy.y + 18, 36, 9).queue() }, 200);
				setTimeout(function () { new RoundDirectAmmo(enemy.x + 18, enemy.y + 18, 36, 9).queue() }, 400);
                break;

            default: break;
        }
    }
}

