import { consume } from '@lit/context'
import { LitElement, PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { surfaceContext2D } from '../lib/surfaceContext'
import { type Context2D, Deletable, DrawableShape } from '../lib/Contexts'
import {
  NO_INTERP,
  createAnimation,
  getStateTree,
  modifyTo,
  updateAnimation,
  Animation,
  changeInterpFunction,
  addRecursiveListener,
} from 'aninest'
import {
  Color,
  Vec2,
  colorFromHex,
  colorToHex,
  mergeDictTrees,
  newVec2,
} from '../lib/Utils'
import { Signal } from '@lit-labs/preact-signals'

type RoundedRect = {
  pos: Vec2
  size: { radius: number; width: number; height: number }
  styles: {
    colors: {
      backgroundColor: Color
      borderColor: Color
    }
    borderWidth: number
  }
}

@customElement('pg-rounded-rect')
export default class PGRoundedRect extends LitElement {
  @consume({ context: surfaceContext2D })
  parentContext?: Signal<Context2D | undefined>
  @property({ type: Number })
  x = 0
  @property({ type: Number })
  y = 0
  @property({ type: Number })
  width = 0
  @property({ type: Number })
  height = 0
  @property({ type: Number })
  radius = 0
  @property({ type: Object })
  backgroundColor: Color | undefined = undefined
  @property({ type: Object })
  borderColor: Color | undefined = undefined
  @property({ type: Number })
  borderWidth = 2
  @property({ type: Number })
  zIndex = 0
  @property({ type: Function })
  posInterp = NO_INTERP
  @property({ type: Function })
  sizeInterp = NO_INTERP
  @property({ type: Function })
  stylesInterp = NO_INTERP
  @property({ type: Function })
  colorInterp = NO_INTERP
  animationInfo: Animation<RoundedRect>
  self: DrawableShape<RoundedRect> & Deletable
  constructor() {
    super()
    this.animationInfo = createAnimation<RoundedRect>(
      {
        pos: newVec2(this.x, this.y),
        size: { radius: this.radius, width: this.width, height: this.height },
        styles: {
          colors: {
            backgroundColor: this.backgroundColor || colorFromHex('#000000'),
            borderColor: this.borderColor || colorFromHex('#000000'),
          },
          borderWidth: this.borderWidth,
        },
      },
      NO_INTERP
    )
    this.self = {
      animationInfo: this.animationInfo,
      needsUpdate: true,
      deleteWhenDoneUpdating: false,
      update(dt: number) {
        return updateAnimation(this.animationInfo, dt)
      },
      draw: (ctx: Context2D) => {
        const c = ctx.canvasCtx
        c.save()
        const {
          pos: { x, y },
          size: { radius, width, height },
          styles: {
            colors: { backgroundColor, borderColor },
            borderWidth,
          },
        } = getStateTree(this.animationInfo)
        c.beginPath()
        if (c.roundRect) {
          c.roundRect(x - width / 2, y - height / 2, width, height, radius)
        } else {
          const x0 = x - width / 2,
            y0 = y - height / 2
          // use arcTo to draw rounded corners
          c.moveTo(x0 + radius, y0)
          c.arcTo(x0 + width, y0, x0 + width, y0 + height, radius)
          c.arcTo(x0 + width, y0 + height, x0, y0 + height, radius)
          c.arcTo(x0, y0 + height, x0, y0, radius)
          c.arcTo(x0, y0, x0 + width, y0, radius)
        }
        c.closePath()
        if (backgroundColor.opacity > 0) {
          c.save()
          c.globalAlpha = backgroundColor.opacity
          c.fillStyle = colorToHex(backgroundColor)
          c.fill()
          c.restore()
        }
        if (borderColor.opacity !== 0 && borderWidth !== 0) {
          c.lineWidth = borderWidth
          c.save()
          c.globalAlpha = borderColor.opacity
          c.strokeStyle = colorToHex(borderColor)
          c.stroke()
          c.restore()
        }
        c.restore()
      },
      delete: () => {
        modifyTo(this.animationInfo.children.size, {
          width: 0,
          height: 0,
          radius: 0,
        })
        this.self.deleteWhenDoneUpdating = true
        this.self.needsUpdate = true
      },
    }
    addRecursiveListener(this.animationInfo, 'start', () => {
      this.self.needsUpdate = true
    })
  }
  firstUpdated(): void {
    if (!this.parentContext?.value) throw new Error('No context provided')
    this.parentContext.value.addShape(this.self, this.zIndex)
  }
  /**
   *
   * @returns
   */
  getAnimationInfo(): Animation<RoundedRect> {
    return this.animationInfo
  }
  render() {
    return
  }
  protected shouldUpdate(changedProperties: PropertyValues): boolean {
    let modifyingDict = {}
    let out = false // whether to update the dom or not
    let moddingWidth = false
    changedProperties.forEach((_oldValue, propName) => {
      switch (propName) {
        case 'x':
          modifyingDict = mergeDictTrees(modifyingDict, {
            pos: { x: this.x },
          })
          break
        case 'y':
          modifyingDict = mergeDictTrees(modifyingDict, {
            pos: { y: this.y },
          })
          break
        case 'width':
          modifyingDict = mergeDictTrees(modifyingDict, {
            size: { width: this.width },
          })
          break
        case 'height':
          modifyingDict = mergeDictTrees(modifyingDict, {
            size: { height: this.height },
          })
          break
        case 'radius':
          modifyingDict = mergeDictTrees(modifyingDict, {
            size: { radius: this.radius },
          })
          break
        case 'backgroundColor':
          modifyingDict = mergeDictTrees(modifyingDict, {
            styles: { colors: { backgroundColor: this.backgroundColor } },
          })
          break
        case 'borderColor':
          modifyingDict = mergeDictTrees(modifyingDict, {
            styles: { colors: { borderColor: this.borderColor } },
          })
          break
        case 'borderWidth':
          moddingWidth = true
          modifyingDict = mergeDictTrees(modifyingDict, {
            styles: { borderWidth: this.borderWidth },
          })
          break
        case 'posInterp':
          changeInterpFunction(this.animationInfo.children.pos, this.posInterp)
          break
        case 'sizeInterp':
          changeInterpFunction(
            this.animationInfo.children.size,
            this.sizeInterp
          )
          break
        case 'stylesInterp':
          changeInterpFunction(
            this.animationInfo.children.styles,
            this.stylesInterp
          )
          break
        case 'colorInterp':
          changeInterpFunction(
            this.animationInfo.children.styles.children.colors,
            this.colorInterp
          )
          break
        default:
          out = true
          break
      }
    })
    if (
      (modifyingDict as any)?.styles?.width ||
      this.animationInfo.children.styles._to !== null
    )
      console.log('MODIFYING DICT', modifyingDict)
    modifyTo(this.animationInfo, modifyingDict)
    if (!this.hasUpdated) {
      changeInterpFunction(this.animationInfo.children.pos, NO_INTERP)
      changeInterpFunction(this.animationInfo.children.size, NO_INTERP)
      changeInterpFunction(this.animationInfo.children.styles, NO_INTERP)
      changeInterpFunction(
        this.animationInfo.children.styles.children.colors,
        NO_INTERP
      )
      setTimeout(() => {
        changeInterpFunction(this.animationInfo.children.pos, this.posInterp)
        changeInterpFunction(this.animationInfo.children.size, this.sizeInterp)
        changeInterpFunction(
          this.animationInfo.children.styles,
          this.stylesInterp
        )
        changeInterpFunction(
          this.animationInfo.children.styles.children.colors,
          this.colorInterp
        )
      }, 100)
    }
    return out || !this.hasUpdated
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-rounded-rect': PGRoundedRect
  }
}
