function calculate(args){
    let dict = {};
    let stringObj = '';
    for(let i = 0; i<args.length; i++){
        if(!isNaN(args[i].split(' -> ')[1])) {
            dict[args[i].split(' -> ')[0]] = Number(args[i].split(' -> ')[1]);
        }
        else{
            dict[args[i].split(' -> ')[0]] = args[i].split(' -> ')[1];
        }
    }
    stringObj = JSON.stringify(dict);
    console.log(stringObj);
}