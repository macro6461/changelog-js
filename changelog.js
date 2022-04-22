#!/usr/bin/env node
const {readFileSync, writeFileSync, appendFile, existsSync} = require('fs');
const path = './CHANGELOG.md'
// if you download a package to help run git log --describe
// you can remove the below require statement, the result function
// and in getTaggedVersion put package logic
const exec = require('child_process').exec;

const result = (command, cb) => {
    var child = exec(command, (err, stdout, stderr)=>{
        if(err != null){
            return cb(new Error(err), null);
        }else if(typeof(stderr) != "string"){
            return cb(new Error(stderr), null);
        }else{
            return cb(null, stdout);
        }
    });
    return child
}

const getTaggedVersion = () => {
    result("git describe --long", (err, response) => {
        if(!err){
            console.log(response);
        }else {
            console.log(err);
        }
    });
}

const d = new Date()
const today=d.toISOString().slice(0, 10)
var version="1.2.3"
// uncomment below line to get tagged version with git describe --long
// var version = getTaggedVersion()

const item = `## [${version}] - ${today}`

const changelogStart=`# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

${item}
### Added
- ADD CHANGE HERE!
`

const checkIfItemExists = (str) => {
    const contents = readFileSync('CHANGELOG.md', 'utf-8');

    const result = contents.includes(str);

    return result;
}

const writeChangelog = () =>{
    const fileData = readFileSync("CHANGELOG.md", { encoding: "utf8" });
    const fileDataArray = fileData.split("\n");
    const iterateArr = [...fileDataArray]
    for (var i = 0; i < iterateArr.length; i++){
        if (fileDataArray[i].indexOf("## [Unreleased]") > -1){
            fileDataArray.splice(i + 1, 0, `\n${item}\n### Added\n- ADD CHANGE HERE!`);
            const newFileData = fileDataArray.join("\n");
            writeFileSync("CHANGELOG.md", newFileData, { encoding: "utf8" });
            break
        }
    }
}

const newChangelog = () => {
    appendFile("CHANGELOG.md", changelogStart, (err) => {
        if (err) throw err;
        console.log('Changelog is created successfully.');
      })
}

const newChangelogItem = () => {
    if (checkIfItemExists(item)){
        console.log(`Changelog item already exists for \n   ${item}`)
    } else {
        writeChangelog()
    }
}

const init = () => {
    try {
        if (existsSync(path)) {
            newChangelogItem()
        } else {
            newChangelog()
        }
      } catch(err) {
        console.error(err)
      }
}

init()