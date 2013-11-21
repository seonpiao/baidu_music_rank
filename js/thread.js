var fs = require('fs');
var path = require('path');
var gui = require('nw.gui');
var maxLog = 400;

var logs = [];

var confPath = './';

var confFile = fs.readFileSync(path.join(confPath,'config.json'));
var config = JSON.parse(confFile);

function log(s){
    var log = '<p class="log">[' + (new Date()).toLocaleString() + '] ' + s + '</p>';
    var logElem = document.getElementById('log');
    if(logs.length < maxLog){
        logs.push(log);
    }
    else{
        logs.shift();
        logs.push(log);
    }
    logElem.innerHTML = logs.join('');
    var y = 99999;
    window.scrollTo(0,y);
}

function attachScript(win,url,callback){
    var doc = win.document;
    var script = doc.createElement('script');
    if(callback){
        script.addEventListener('load',callback);
    }
    script.src = url;
    doc.getElementsByTagName('head')[0].appendChild(script);
}

var timer;

function countdown(n){
    if(timer){
        clearInterval(timer);
    }
    timer = setInterval(function() {
        n--;
        if(n === 0){
            clearInterval(timer);
            timer = null;
        }
        document.title = '百度音乐助手 - ' + n + '秒后自动播放下一首';
    }, 1000);
}

global.log = log;
global.attachScript = attachScript;
global.countdown = countdown;

var win = gui.Window.get();
win.on('close',function(){
    gui.App.quit();
});

jQuery(function(){

    log('inited.');
    log('begin to load search window.');

    var swin = gui.Window.open('http://music.baidu.com/search?key=test',{
        show:true,
        frame:true,
        toolbar:true,
        webkit:{plugin:true}
    });

    swin.on('loaded',function(e){
        log('search window loaded.');
        attachScript(swin.window,'app://baidu_music/js/jQuery2.0.3.js',function(){
            log('jQuery attached.');
            attachScript(swin.window,'app://baidu_music/js/search.js',function(){
                log('search.js attached');
            });
        })
    });

    jQuery('#showplaywin').on('click',function(e){
        if(!global.pwin){
            e.target.checked = false;
            return;
        }
        if(e.target.checked){
            global.pwin.show();
            global.pwin.focus();
        }
        else{
            global.pwin.hide();
        }
    });
});