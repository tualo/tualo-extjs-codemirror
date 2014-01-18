var fs = require('fs');
var path = require('path');

var walk = function(dir, done,_cutof) {
	var results = [];
	
	if (typeof _cutof=='undefined'){
		_cutof=dir.length;
	}
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		var pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(function(file) {
			file = path.join(dir, file);
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					},_cutof);
				} else {
					results.push(file.substring(_cutof));
					if (!--pending) done(null, results);
				}
			});
		});
	});
};

var main_file_path = path.join(__dirname,'..','node_modules','codemirror');
var allowed_paths = ['lib','addon','mode','theme'];
var files=[];
var js_files=[];
var css_files=[];
var middleware=function(req,res,next){
	var i=0;
	for (var i=0; i < allowed_paths.length; i++){
		if (req.url.indexOf('/codemirror/'+allowed_paths[i]+'/')==0){
			
			var url_part = req.url.substring(11);
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
walk(main_file_path,function(err,res){
	for(var i in res){
		if (path.extname(res[i])=='.js'){
			js_files.push(res[i]);
			files.push(res[i]);
		}
		if (path.extname(res[i])=='.css'){
			css_files.push(res[i]);
			files.push(res[i]);
		}
	};
});

exports.javascripts = js_files;
exports.stylesheets = css_files;

exports.middleware = middleware;
