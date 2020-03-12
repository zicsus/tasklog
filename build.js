'use strict';

const fs = require('fs');
const path = require('path');
const terser = require('terser');
const Config = require('./build-config.json');

// Join path folders in cofig.
const srcDir = path.join(__dirname, Config.src);
const buildDir = path.join(__dirname, Config.build);

const ignoreDirs = [];
for (let i in Config.ignore)
{
	ignoreDirs.push(path.join(buildDir, Config.ignore[i]));
}

// Keep record of all the directories and files found.
const files = [];

function readDirectory(dirPath)
{
	const dirs = [];
	const dirFiles = fs.readdirSync(dirPath);
	
	for (let i in dirFiles)
	{
		const pathname = path.join(dirPath, dirFiles[i]);
		const stat = fs.statSync(pathname);

		if (stat.isFile())
		{
			files.push(pathname);
		}
		else if (stat.isDirectory())
		{
			var newDir = pathname.replace(srcDir, buildDir);
			if (!fs.existsSync(newDir)) 
			{
				fs.mkdirSync(newDir);
			}

			dirs.push(pathname);
		}
	}

	for (let i in dirs)
	{
		let dir = dirs[i];
		readDirectory(dir);
	}
}

function copyFiles()
{
	for (let i in files)
	{
		const pathname = files[i].replace(srcDir, buildDir);
		fs.copyFileSync(files[i], pathname);
		files[i] = pathname;
	}
}

function ignore(pth)
{
	let ignore = false;
	for(let f in ignoreDirs)
	{
		if(pth.startsWith(ignoreDirs[f]))
		{
			ignore = true;
			break;
		}
	}

	return ignore;
}

function minify()
{
	for (let i in files)
	{
		const filePath = files[i];

		if (!filePath.endsWith(".js"))
			continue;

		if (ignore(filePath))
			continue;

		console.log(`>> Building - ${filePath}`);

		const code = fs.readFileSync(filePath, "utf-8");
		const result = terser.minify(code);
		
		if (result.error)
		{
			console.log(`>> Minification failed - ${filePath}`, result.error);
			process.exit(1);
		}

		fs.writeFileSync(filePath, result.code);
	}
}

function build(options)
{
	console.log(">> Building...");

	// Read all the directories from the src dir and create any dir found in build dir.
	readDirectory(srcDir);

	// Copy files to build directory.
	copyFiles();

	// Minify files
	minify();

	console.log(">> Build Successful :)");
}

module.exports = build;