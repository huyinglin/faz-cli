const fs = require('fs');

function updateJsonFile(fileName, obj) {
  return new Promise(resolve => {
    if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName).toString();
      let json = JSON.parse(data);
      Object.keys(obj).forEach(key => {
        if (obj[key]) {
          json[key] = obj[key];
        }
      });
      fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
      resolve();
    }
  });
}

module.exports = {
  updateJsonFile
}
