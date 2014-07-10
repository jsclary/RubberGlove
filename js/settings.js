function persistConfig(fileName, data, callback) {
  console.log("RubberGlove: Requesting quota");
  navigator.webkitTemporaryStorage.requestQuota(1024*1024, function(grantedBytes) {
    console.log("RubberGlove: Granted quota of " + grantedBytes);
    window.webkitRequestFileSystem(TEMPORARY, grantedBytes, function(fs) {
      console.log("RubberGlove: Got FileSystem");
      fs.root.getFile(fileName, {create: true}, function(fileEntry) {
        console.log("RubberGlove: Got file " + fileEntry.name);
        fileEntry.createWriter(function(fileWriter) {
          console.log("RubberGlove: Got writer");
          fileWriter.onwriteend=function(e) {
            console.log("RubberGlove: onWriteEnd");
            fileWriter.onwriteend=null;
            var blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
            fileWriter.write(blob);
          }
          fileWriter.truncate(0);
        });
      }, fsErrorHandler);
    }, fsErrorHandler);
  });
}

function fsErrorHandler(e) {
  console.error(e.name + ": " + e.message);
}

function getConfigAsync(fileName, callback) {
  window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
    window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function(fs) {
      fs.root.getFile(fileName, {create: false}, function(fileEntry) {
        // TODO: Finish writing this!
      });
    });
  });
}