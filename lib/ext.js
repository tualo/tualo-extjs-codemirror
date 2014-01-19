var fs = require('fs'),
    path = require('path'),
    allowed_paths = ['lib','addon','mode','theme'],
    js_files = [],
    css_files = [],
    i,
    m,
    files = walk(path.join(__dirname,'..','node_modules','codemirror'),true);


function middleware(req,res,next){
    var i,
        url_part,
        m=allowed_paths.length;
    for (i=0; i < m; i++){
        if (req.url.indexOf('/codemirror/'+allowed_paths[i]+'/')==0){

            url_part = req.url.substring(11);
            if (url_part.indexOf('?')>=0){
                url_part = url_part.substring(0,url_part.indexOf('?'));
            }
            if(files.indexOf(url_part)>=0){
                res.sendfile(path.join(__dirname,'..','node_modules','codemirror',url_part));
            }else{
                res.send(403, 'Sorry! you cant see that.');
            }
            return;
        }
    }
    next();
}

function walk(dir,start,_cutof) {
    var list,
        i,
        m,
        file,
        stat,
        results = [];

    if (typeof _cutof=='undefined'){
        _cutof=dir.length;
    }
    list = fs.readdirSync(dir);

    if (list){
        for(i=0,m=list.length;i<m;i+=1){
            file = list[i];
            if ((!start)||(allowed_paths.indexOf(file)>=0)){
                file = path.join(dir, file);
                stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    results = results.concat(walk(file,false,_cutof));
                } else {
                    results.push(file.substring(_cutof));
                }
            }
        }

    }
    return results;
}


for(i = 0,m,files.length;i<m;i+=1){
    if (path.extname(files[i]) == '.js'){
        js_files.push(files[i]);
    }
    if (path.extname(files[i]) == '.css'){
        css_files.push(files[i]);
    }
}


exports.stylesheet = css_files;
exports.javascript = js_files;
exports.middleware = middleware;
