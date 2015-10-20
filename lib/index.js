/**
 * @files 加载sugar框架的各类配置，各类lib
 * @author fengshangshi
 */

var fs = require('fs');
var rd = require('rd');
var path = require('path');

/**
 * 处理-连字符
 * 把减号连字符的后面的第一个字母大写
 */
var replaceMinus = function(str) {
	return str.replace(/([-]+\w)/, function(s) {
		s = s.replace(/[-]/, '');
		return s.toUpperCase();
	});
};

/**
 * 首字母大小写
 */
var replaceFirstLetter = function(str, lower) {
	return str.replace(/\b(\w)/, function(s) {
		return lower === true ? s.toLowerCase() : s.toUpperCase();
	});
};

/**
 * 去掉后缀
 */
var baseName = function(str) {
	return path.basename(str, path.extname(str));
};

var load =  exports.load = function(dir, root) {
	var files = rd.readFileSync(dir);
	var loader = {};

	root = root || __dirname;

	files.forEach(function(file) {
		var relativePath = path.relative(root, file);
		relativePath = relativePath.split(path.sep);

		var fileNames = [];
		relativePath.forEach(function(p) {
			p = p.toLowerCase();
			p = replaceMinus(p);
			p = replaceFirstLetter(p);
			p = baseName(p);

			['.', '..'].indexOf(p) < 0 && fileNames.push(p);
		});

		var fileName = fileNames.join('');
		fileName = replaceFirstLetter(fileName, true);
		
		loader[fileName] = require(file);
	});

	return loader;
};