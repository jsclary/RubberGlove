RubberGlove
===========

Blocks common browser fingerprint techniques to improve your privacy.

RubberGlove aims to reduce the ability of websites to globally fingerprint your browser.  The Electronic Frontier Foundation's website, panopticlick.eff.org, and the associated study shows just how effective these techniques are for tracking you even without cookies.

Currently it wraps the window.navigator and window.clientInformation objects to cloak plugins and mime types similar to the way Firefox and IE do.

Planned future features:
* Reduction of detailed version information both in window.navigator and the http User-Agent header.
* Prevention of time skew and drift fingerprinting
* Prevention of canvas based fingerprinting

Currently Chrome does not make it possible to get configuration information early enough in the page load to be useful.  This may delay any features which need to be configured or selectively disabled.

Please note that until this plugin or others like it are widely used, Panopticlick will likely still report your browser as unique despite the reduction in bits of identifying information.
