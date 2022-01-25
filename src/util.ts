//@ts-nocheck
public function RelativeTime(local:string,nbSecond:number):string{
    const rtf = new Intl.RelativeTimeFormat(local, { numeric: 'auto' });
    const nbSecondByLevel:Map<string,number> = new Map();
    nbSecondByLevel.set('second',1);
    nbSecondByLevel.set('minute',nbSecondByLevel.get('second') * 60);
    nbSecondByLevel.set('hour',nbSecondByLevel.get('minute') * 60);
    nbSecondByLevel.set('day',nbSecondByLevel.get('hour') * 24);
    nbSecondByLevel.set('week',nbSecondByLevel.get('day') * 7);
    nbSecondByLevel.set('month',nbSecondByLevel.get('day') * 30);
    nbSecondByLevel.set('year',nbSecondByLevel.get('day') * 365);

    var smallestLevel = Array.from(nbSecondByLevel.entries()).map(
        (x):[string,number]=>{
            //Le nombre d'unité de temps entiere
            return [x[0],Math.floor(Math.abs(nbSecond)/x[1]) * (Math.abs(nbSecond)/nbSecond)];
        }
    ).filter(
        (x):boolean=>{
            return x[1]!=0;
        }
    ).slice(-1)[0]
    
    return rtf.format(smallestLevel[1],smallestLevel[0])


}

export {RelativeTime}