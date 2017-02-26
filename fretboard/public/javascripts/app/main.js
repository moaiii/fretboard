var Notemap = {
  images: []
};

Notemap.App = function() {
  this.init();
  this.animateVeil();
};

Notemap.App.prototype.animateVeil = function() {

	var leftpoint = (window.innerWidth * 0.5) - (353);

  var absoluteOffset = anime.timeline({
	});

  absoluteOffset
    .add([
      {
        targets: '#title-veil',
				left: [ { value: leftpoint } ],
        width: [ { value: 700, delay: 250 } ],
				height: [ { value: 205 }, { value: 0, delay: 750 } ],
				opacity: [ { value: 0, delay: 1800 } ],
        easing: 'easeInExpo',
				duration: 500,
        offset: 0
      },
      {
        targets: '#title-block',
        opacity: {
          value: 1
        },
				duration: 10,
        easing: 'easeOutExpo',
        offset: 1000
      },
			{
				targets: '#hero-container',
				opacity: {
					value: 1
				},
				easing: 'easeOutExpo',
				duration: 3000,
				offset: 2000
			}
    ]);
};

Notemap.App.prototype.init = function() {
  Notemap.images = this.getImages();
  document.addEventListener('mousemove', this.slideImage);
};

Notemap.App.classnames_ = {
  SLIDING_IMAGES: 'hero-image',
};

Notemap.App.prototype.getImages = function() {
  var images =
    document.getElementsByClassName(Notemap.App.classnames_.SLIDING_IMAGES);

  return images;
};

Notemap.App.prototype.slideImage = function() {

  var mouseX = event.clientX;
  var ratio = mouseX / window.innerWidth;

  var leftImageWidth = mouseX;
  var rightImageWidth = window.innerWidth - mouseX;

  Notemap.images[0].setAttribute('style', "width:"+ leftImageWidth +"px");
};

window.onload = function() {
  Notemap.app = new Notemap.App();
  console.log(Notemap.app);
};




{/* <script type="text/javascript" id="gwd-init-code">
  (function() {
    var gwdAd = document.getElementById('gwd-ad');
    var counter = 0;

    var scene1 = document.getElementById('scene-1');
    var scene1text = document.getElementById('scene-1-text');
    var scene2 = document.getElementById('scene-2');
    var scene3 = document.getElementById('scene-3');
    var scene4 = document.getElementById('scene-4');
    var scene5 = document.getElementById('scene-5');
    var color = document.getElementById('google-color');
    var white = document.getElementById('google-white');
    var gicon = document.getElementById('g-logo');
    var mic = document.getElementById('mic-icon');
    var searchBar = document.getElementById('search-bar');
    var searchText = document.getElementById('search-text');
    var veil = document.getElementById('veil');
    var resultBox = document.getElementById('result-box');
    var resultContent = document.getElementById('result-contents');

    var bannerHeight = 250;
    var bannerWidth = 300 + 5;
    var horizontalSlide = false;

    var tl = new TimelineLite({
        paused: true,
        onComplete: complete
      })
      .to([scene1, scene1text, color], 0.7, {
        opacity: 1,
        ease: Expo.easeOut
      })
      .to([scene1text, color], 0.2, {
        opacity: 0,
        ease: Expo.easeOut
      }, 2)
      .to([scene1], 0.5, {
        top: 25,
        height: 0,
        ease: Expo.easeIn
      }, 2.2)
      .to([scene2, searchBar, white], 0, {
        opacity: 1
      }, 2.2)
      .to([scene1], 0.2, {
        width: 0,
        left: 150
      }, 2.7)
      .to([searchBar], 1, {
        width: 250,
        height: 35
      }, 2)
      .to([gicon, mic], 0, {
        opacity: 1,
        ease: Expo.easeOut
      }, 3.2)
      .to([searchText, veil], 0, {
        opacity: 1,
        ease: Expo.easeOut
      }, 3.5)
      .to([searchText], 0, {
        opacity: 1,
        ease: Expo.easeOut
      }, 3.5)
      .to([veil], 1.5, {
        left: 210,
        width: 0
      }, 3.5)
      .to([scene2], 0.4, {
        y: -bannerHeight
      }, 6)
      .to([scene2], 0.4, {
        opacity: 0
      }, 6.2)
      .to([scene3, resultBox], 0, {
        opacity: 1
      }, 6)
      .to([resultBox], 0.5, {
        height: 125
      }, 6.5)
      .to([resultContent], 1, {
        opacity: 1
      }, 6.5)
      .to([scene3], 0.4, {
        y: -bannerHeight
      }, 9)
      .to([scene3], 0.4, {
        opacity: 0
      }, 9.2)
      .to([scene4], 0, {
        opacity: 1
      }, 9)
      .to([resultBox, resultContent], 0.4, {
        opacity: 0
      }, 10.5)
      .to([searchText, white, gicon, mic], 0, {
        opacity: 0
      }, 12)
      .to([searchBar], 0.5, {
        height: 250,
        width: 400,
        top: 0
      }, 12)
      .to([scene4, searchBar], 0, {
        opacity: 0
      }, 12.5)
      .to([scene5, color], 1, {
        opacity: 1
      }, 12.5)
      .to([scene5], 0, {
        opacity: 0
      }, 15);

     function complete() {
       counter++;

       if (counter < 2) {
         tl.restart();
       }

       if(counter == 2) {
         scene5.style.opacity = '1';
         scene5.style.transform = '(1, 0, 0, 1, 0, 0);';
       }
     }

    function handleWebComponentsReady(event) {
      // Start the Ad lifecycle.
      setTimeout(function() {
        gwdAd.initAd();
      }, 0);
    }

    function handleAdInitialized(event) {
      tl.play();
    } */}

  // 	window.addEventListener('DOMContentLoaded',
  // 		handleDomContentLoaded, false);
  // 	window.addEventListener('WebComponentsReady',
  // 		handleWebComponentsReady, false);
  // 	window.addEventListener('adinitialized',
  // 		handleAdInitialized, false);
  // })();
