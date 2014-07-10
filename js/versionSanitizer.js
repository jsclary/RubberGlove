function sanitizeVersions(version) {
  return version.replace(/(\b(?:[0-9]+\.?)+\b)/g, function(match) {
    var version = match.split('.');
    var foundMajor = false;
    for(var i=0; i < version.length; i++) {
      var number = parseInt(version[i]);
      if(number > 0) {
        if(foundMajor) version[i] = 0;
        else foundMajor = true;
      }
    }
    return version.join(".");
  });
}