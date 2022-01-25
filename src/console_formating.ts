import * as figlet from 'figlet'
import * as Colors from 'colors/safe';

type consoleThemeName = 'MongoDB'|'Server'|'Cache'|'Error'|'wttr'|'sunset'|'water'

type fontType = 'regular'|'special'|'title'|'none'|'connection'


type theme = {
    colors:Array<(s:string)=>string>
    font:{[Properties in fontType]?:figlet.Fonts}
}

type themes = { [Properties in consoleThemeName]:theme}

const theme:themes = {
    'Error':{
        colors:[Colors.bgRed, Colors.white],
        font:{
            title:'Calvin S'
        }
    },
    'MongoDB':{
        colors:[Colors.bgGreen, Colors.black],
        font:{
            special:'Calvin S'
        }
    },
    'Cache':{
        colors:[Colors.bgBlue, Colors.black],
        font:{}
    },
    'wttr':{
        colors:[Colors.bgMagenta, Colors.black],
        font:{}
    },
    'sunset':{
        colors:[Colors.bgCyan, Colors.yellow],
        font:{}
    },
    'water':{
        colors:[Colors.bgBlue, Colors.white],
        font:{}
    },
    'Server':{
        colors:[Colors.yellow],
        font:{
            regular:'Calvin S',
            title:'Big Money-sw',
            special:'4Max',
            connection:'Banner3'
        }
    }
}

function consolef(message:string,_theme:consoleThemeName,_font?:fontType){
    const myTheme = theme[_theme];
    const myFont = myTheme.font[_font || 'regular']
    let outString = message
    if(myFont && _font!='none'){
        outString = figlet.textSync(outString,myFont)
    }
    for (const colorFct of myTheme.colors) {
        outString = colorFct(outString)
    }
    
    console.log(outString)
}

export function getCF(_theme:consoleThemeName){
    return (message:string,_font?:fontType) =>{
        consolef(message,_theme,_font)
    };
}

export function sunset(_theme?:consoleThemeName){
    
    consolef("            ^^                   @@@@@@@@@                               ",'sunset','none');
    consolef("        ^^       ^^            @@@@@@@@@@@@@@@                           ",'sunset','none');
    consolef("                             @@@@@@@@@@@@@@@@@@              ^^          ",'sunset','none');
    consolef("                            @@@@@@@@@@@@@@@@@@@@                         ",'sunset','none');
    consolef("  ~~~~ ~~ ~~~~~ ~~~~~~~~ ~~ &&&&&&&&&&&&&&&&&&&& ~~~~~~~ ~~~~~~~~~~~ ~~~ ",'sunset','none');
    consolef("  ~         ~~   ~  ~       ~~~~~~~~~~~~~~~~~~~~ ~       ~~     ~~ ~     ",'water','none');
    consolef("    ~      ~~      ~~ ~~ ~~  ~~~~~~~~~~~~~ ~~~~  ~     ~~~    ~ ~~~  ~ ~~",'water','none');
    consolef("    ~  ~~     ~         ~      ~~~~~~  ~~ ~~~       ~~ ~ ~~  ~~ ~        ",'water','none');
    consolef("  ~  ~       ~ ~      ~           ~~ ~~~~~~  ~      ~~  ~             ~~ ",'water','none');
    consolef("        ~             ~        ~      ~      ~~   ~             ~        ",'sunset','none');
    console.log();
    console.log();
}