console.log("inside service worker");
const CACHE_NAME = 'static-cache-v1';

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  // "/scripts/app-bundle.js",
  // "/scripts/vendor-bundle.js",
  "/assets/favicon.png",
  // "/assets/favicon_apple_touch.png",
  // "/assets/favicon_maskable.png",
  // "/assets/github-logo.png",
  // "/assets/icons/anvil.svg",
  // "/assets/icons/attribution.json",
  // "/assets/icons/beer-stein.svg",
  // "/assets/icons/bindle.svg",
  // "/assets/icons/bloody-stash.svg",
  // "/assets/icons/brick-pile.svg",
  // "/assets/icons/broken-tablet.svg",
  // "/assets/icons/burning-tree.svg",
  // "/assets/icons/checked-shield.svg",
  // "/assets/icons/coal-wagon.svg",
  // "/assets/icons/crosscut-saw.svg",
  // "/assets/icons/dice.svg",
  // "/assets/icons/direction-signs.svg",
  // "/assets/icons/dough-roller.svg",
  // "/assets/icons/earth-spit.svg",
  // "/assets/icons/empty.svg",
  // "/assets/icons/evil-tower.svg",
  // "/assets/icons/falling-rocks.svg",
  // "/assets/icons/fire-ring.svg",
  // "/assets/icons/fire-shrine.svg",
  // "/assets/icons/forest.svg",
  // "/assets/icons/gold-mine.svg",
  // "/assets/icons/gold-stack.svg",
  // "/assets/icons/hand-saw.svg",
  // "/assets/icons/icicles-aura.svg",
  // "/assets/icons/infested-mass.svg",
  // "/assets/icons/magic-portal.svg",
  // "/assets/icons/meat-cleaver.svg",
  // "/assets/icons/mining.svg",
  // "/assets/icons/monsters",
  // "/assets/icons/oppression.svg",
  // "/assets/icons/ore.svg",
  // "/assets/icons/palisade.svg",
  // "/assets/icons/player",
  // "/assets/icons/prayer.svg",
  // "/assets/icons/rally-the-troops.svg",
  // "/assets/icons/rat.svg",
  // "/assets/icons/sacrificial-dagger.svg",
  // "/assets/icons/small-fire.svg",
  // "/assets/icons/stone-block.svg",
  // "/assets/icons/stone-crafting.svg",
  // "/assets/icons/sword-brandish.svg",
  // "/assets/icons/tear-tracks.svg",
  // "/assets/icons/tumulus.svg",
  // "/assets/icons/two-coins.svg",
  // "/assets/icons/vortex.svg",
  // "/assets/icons/wheat.svg",
  // "/assets/icons/windmill.svg",
  // "/assets/icons/monsters/half-body-crawling.svg",
  // "/assets/icons/monsters/harry-potter-skull.svg",
  // "/assets/icons/monsters/rock-golem.svg",
  // "/assets/icons/monsters/spiked-dragon-head.svg",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log("[ServiceWorker] Removing old cache", key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      console.log("fetch request: ", response, e.request);
      return response || fetch(e.request);
    }).catch((e) => console.log("Error fetching: ", e))
  );
});
