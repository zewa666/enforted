import { FrameworkConfiguration } from "aurelia-framework";
import { TemplatingEngine } from "aurelia-templating";
import { WebAnimationAnimator } from "./animator";

/**
 * Configuires the WebAnimationAnimator as the default animator for Aurelia.
 * @param config The FrameworkConfiguration instance.
 * @param callback A configuration callback provided by the plugin consumer.
 */
export function configure(config: FrameworkConfiguration, callback?: (animator: WebAnimationAnimator) => void): void {
  const animator = config.container.get(WebAnimationAnimator);
  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === "function") { callback(animator); }
}
