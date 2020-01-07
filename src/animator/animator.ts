import { DOM } from "aurelia-pal";
import { animationEvent, Animator } from "aurelia-templating";

interface CssAnimation {
  className: string;
  element: Element;
}

/**
 * An implementation of the Animator using CSS3-Animations.
 */
export class WebAnimationAnimator extends Animator {
  public isAnimating: boolean = false;

  /**
   * Execute a single animation.
   * @param element Element to animate
   * @param className Properties to animate or name of the effect to use.
   *  For css animators this represents the className to be added and removed right after the animation is done.
   * @param options options for the animation (duration, easing, ...)
   * @returns Resolved when the animation is done
   */
  public animate(
    element: Element | Element[],
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null | any,
    options?: number | KeyframeAnimationOptions
  ): Promise<boolean> {
    const animation = (element as HTMLElement).animate(keyframes, options);
    return animation.finished.then(() => true);
  }

  /**
   * Run a sequence of animations one after the other.
   * @param sequence An array of effectNames or classNames
   * @returns Resolved when all animations are done
   */
  public runSequence(animations: CssAnimation[]): Promise<boolean> {
    return Promise.resolve(false);
  }

  /**
   * Execute an 'enter' animation on an element
   * @param element Element to animate
   * @returns Resolved when the animation is done
   */
  public enter(element: Element): Promise<boolean> {
    return Promise.resolve(false);
  }

  /**
   * Execute a 'leave' animation on an element
   * @param element Element to animate
   * @returns Resolved when the animation is done
   */
  public leave(element: Element): Promise<boolean> {
    return Promise.resolve(false);
  }

  /**
   * Add a class to an element to trigger an animation.
   * @param element Element to animate
   * @param className Properties to animate or name of the effect to use
   * @param suppressEvents Indicates whether or not to suppress animation events.
   * @returns Resolved when the animation is done
   */
  public removeClass(element: Element, className: string, suppressEvents: boolean = false): Promise<boolean> {
    return Promise.resolve(false);
  }

  /**
   * Add a class to an element to trigger an animation.
   * @param element Element to animate
   * @param className Properties to animate or name of the effect to use
   * @param suppressEvents Indicates whether or not to suppress animation events.
   * @returns Resolved when the animation is done
   */
  public addClass(element: Element, className: string, suppressEvents: boolean = false): Promise<boolean> {
    return Promise.resolve(false);
  }
}
