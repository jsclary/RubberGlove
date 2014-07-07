var scriptCleanupFunction = function() {
  if(document.currentScript.id == '_RubberGlove_removeHead')
    document.currentScript.parentNode.parentNode.removeChild(document.currentScript.parentNode);
  else
    document.currentScript.parentNode.removeChild(document.currentScript);
}