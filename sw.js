const CACHE_NAME = 'static-cache-v4';

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/enforted/scripts/app-bundle.js",
  "/enforted/scripts/vendor-bundle.js",
  "/enforted/assets/favicon.png",
  "/enforted/assets/favicon_apple_touch.png",
  "/enforted/assets/favicon_maskable.png",
  "/enforted/assets/favicon_maskable_192.png",
  "/enforted/assets/github-logo.png",
  "/enforted/assets/icons/anvil.svg",
  "/enforted/assets/icons/attribution.json",
  "/enforted/assets/icons/beer-stein.svg",
  "/enforted/assets/icons/bindle.svg",
  "/enforted/assets/icons/bloody-stash.svg",
  "/enforted/assets/icons/brick-pile.svg",
  "/enforted/assets/icons/broken-tablet.svg",
  "/enforted/assets/icons/burning-tree.svg",
  "/enforted/assets/icons/checked-shield.svg",
  "/enforted/assets/icons/coal-wagon.svg",
  "/enforted/assets/icons/crosscut-saw.svg",
  "/enforted/assets/icons/dice.svg",
  "/enforted/assets/icons/direction-signs.svg",
  "/enforted/assets/icons/dough-roller.svg",
  "/enforted/assets/icons/earth-spit.svg",
  "/enforted/assets/icons/empty.svg",
  "/enforted/assets/icons/evil-tower.svg",
  "/enforted/assets/icons/falling-rocks.svg",
  "/enforted/assets/icons/fire-ring.svg",
  "/enforted/assets/icons/fire-shrine.svg",
  "/enforted/assets/icons/forest.svg",
  "/enforted/assets/icons/gold-mine.svg",
  "/enforted/assets/icons/gold-stack.svg",
  "/enforted/assets/icons/hand-saw.svg",
  "/enforted/assets/icons/icicles-aura.svg",
  "/enforted/assets/icons/infested-mass.svg",
  "/enforted/assets/icons/magic-portal.svg",
  "/enforted/assets/icons/meat-cleaver.svg",
  "/enforted/assets/icons/mining.svg",
  "/enforted/assets/icons/oppression.svg",
  "/enforted/assets/icons/ore.svg",
  "/enforted/assets/icons/palisade.svg",
  "/enforted/assets/icons/prayer.svg",
  "/enforted/assets/icons/rally-the-troops.svg",
  "/enforted/assets/icons/rat.svg",
  "/enforted/assets/icons/sacrificial-dagger.svg",
  "/enforted/assets/icons/small-fire.svg",
  "/enforted/assets/icons/stone-block.svg",
  "/enforted/assets/icons/stone-crafting.svg",
  "/enforted/assets/icons/sword-brandish.svg",
  "/enforted/assets/icons/tear-tracks.svg",
  "/enforted/assets/icons/tumulus.svg",
  "/enforted/assets/icons/two-coins.svg",
  "/enforted/assets/icons/vortex.svg",
  "/enforted/assets/icons/wheat.svg",
  "/enforted/assets/icons/windmill.svg",
  "/enforted/assets/icons/monsters/half-body-crawling.svg",
  "/enforted/assets/icons/monsters/harry-potter-skull.svg",
  "/enforted/assets/icons/monsters/rock-golem.svg",
  "/enforted/assets/icons/monsters/spiked-dragon-head.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      
      return cache.addAll(self.location.host.startsWith("localhost")
        ? FILES_TO_CACHE.map(i => i.replace("/enforted/", "/"))
        : FILES_TO_CACHE);
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
      return response || fetch(e.request);
    }).catch((e) => console.log("Error fetching: ", e))
  );
});
