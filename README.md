![logo][3] RubberGlove
===========

Blocks common browser fingerprint techniques to improve your privacy.

[Install the latest version from the Chrome web store.][1]

[View your Browser Object Model with RubberGlove.bomViewer][4]

RubberGlove aims to reduce the ability of websites to globally fingerprint your browser.  The Electronic Frontier Foundation's website, [panopticlick.eff.org][2], and the associated study shows just how effective these techniques are for tracking you even without cookies.

Currently it wraps the window.navigator and window.clientInformation objects to cloak plugins and mime types similar to the way Firefox and IE do.

Planned future features:
* Ability to add per-site exceptions (in progress)
* Reduction of detailed version information both in window.navigator and the http User-Agent header. (in progress)
* Prevention of time skew and drift fingerprinting
* Prevention of canvas based fingerprinting

Please note that until this plugin or others like it are widely used, Panopticlick will likely still report your browser as unique despite the reduction in bits of identifying information.

  [1]: https://chrome.google.com/webstore/detail/rubberglove/koabfojebhfdjnligkcihoeekimoekpg?authuser=1
  [2]: https://panopticlick.eff.org
  [3]: https://github.com/jsclary/RubberGlove/raw/master/images/icon32.png
  [4]: http://cdn.rawgit.com/jsclary/RubberGlove/master/bomViewer/index.html
