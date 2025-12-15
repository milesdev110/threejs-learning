import { InteractiveGroup } from "three/examples/jsm/interactive/InteractiveGroup"
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

export default class Labels {
  constructor(viewer) {
    this.viewer = viewer
    this.group = new InteractiveGroup(this.viewer.renderer, this.viewer.camera)
    this.viewer.scene.add(this.group)
    
    // 初始化交互事件
    this.setupInteractivity()
  }
  
  /**
   * 设置交互事件
   */
  setupInteractivity() {
    // 监听点击事件
    this.group.addEventListener('click', (event) => {
      if (event.target && event.target.element) {
        const htmlElement = event.target.element
        // 获取标签的 DOM 元素
        const labelElement = htmlElement.parentElement
        if (labelElement) {
          // 触发自定义点击事件
          this.triggerClickEvent(event, labelElement)
        }
      }
    })
  }
  
  /**
   * 触发点击事件
   */
  triggerClickEvent(threeEvent, labelElement) {
    // 创建自定义事件
    const event = new CustomEvent('labelClick', {
      detail: {
        threeEvent,
        labelElement,
        label: threeEvent.target,
        position: threeEvent.target.position
      },
      bubbles: true
    })
    
    // 触发在 DOM 元素上的事件
    labelElement.dispatchEvent(event)
  }
  
  /**
   * 添加2d标签
   * @param {*} position 
   * @param {*} html html内容
   * @param {Object} options 配置选项
   * @param {Function} onClick 点击回调函数
   */
  addCss2dLabel(position = { x: 0, y: 0, z: 0 }, html = "", onClick = null) {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.innerHTML = html
    
    // 添加可点击样式
    div.style.cursor = 'pointer'
    div.style.pointerEvents = 'auto'  // 确保可点击
    
    // 设置用户自定义样式
    // if (options.style) {
    //   Object.assign(div.style, options.style)
    // }
    
    const label = new CSS2DObject(div)
    label.position.set(position.x, position.y, position.z)
    
    // 将标签添加到 InteractiveGroup
    this.group.add(label)
    
    // 为 DOM 元素添加点击监听
    if (onClick) {
      div.addEventListener('click', (event) => {
        event.stopPropagation()
        onClick({
          label,
          element: div,
          position: label.position,
          originalEvent: event
        })
      })
    }
    
    return {
      label,
      element: div
    }
  }
  
  /**
   * 移除标签
   */
  removeLabel(label) {
    if (label && label.parent) {
      this.group.remove(label)
    }
  }
}