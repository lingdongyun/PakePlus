window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug

const hookClick = (e) => {
    const target = e.target

    if (!(target instanceof Element)) {
        return
    }

    // 自定义按钮不参与链接拦截
    if (
        target.closest('#custom-top-buttons') ||
        target.closest('#custom-top-slogan')
    ) {
        return
    }

    const origin = target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )

    console.log('origin', origin, isBaseTargetBlank)

    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

/**
 * 拦截 window.open：
 * 新窗口链接改为当前窗口打开。
 */
window.open = function (url, target, features) {
    console.log('open', url, target, features)

    if (url) {
        location.href = url
    }

    return window
}

document.addEventListener('click', hookClick, { capture: true })

/**
 * 之前拖动版脚本保存位置时使用的名称。
 * 这里继续读取，因此会保持你现在调整好的位置。
 */
const CUSTOM_POSITION_KEYS = {
    buttons: 'custom_top_buttons_position_v1',
    slogan: 'custom_top_slogan_position_v1'
}

/**
 * 读取已经保存的位置。
 * 如果没有保存记录，则使用截图对应的默认位置。
 */
const readSavedPosition = (key, defaultPosition) => {
    try {
        const savedValue = localStorage.getItem(key)

        if (!savedValue) {
            return defaultPosition
        }

        const parsedValue = JSON.parse(savedValue)

        if (
            typeof parsedValue.left === 'number' &&
            typeof parsedValue.top === 'number'
        ) {
            return {
                left: parsedValue.left,
                top: parsedValue.top
            }
        }
    } catch (error) {
        console.warn('读取保存位置失败：', error)
    }

    return defaultPosition
}

/**
 * 防止窗口大小变化时按钮跑出屏幕。
 */
const keepInsideWindow = (left, top, element) => {
    const maxLeft = Math.max(
        0,
        window.innerWidth - element.offsetWidth
    )

    const maxTop = Math.max(
        0,
        window.innerHeight - element.offsetHeight
    )

    return {
        left: Math.min(Math.max(0, left), maxLeft),
        top: Math.min(Math.max(0, top), maxTop)
    }
}

const addFixedTopContent = () => {
    // 删除旧脚本可能残留的内容
    document.getElementById('custom-top-style')?.remove()
    document.getElementById('custom-top-buttons')?.remove()
    document.getElementById('custom-top-slogan')?.remove()

    /*
     * 优先读取你刚才拖动后保存的坐标。
     * 下面的数字只是没有保存坐标时的备用值。
     */
    const buttonPosition = readSavedPosition(
        CUSTOM_POSITION_KEYS.buttons,
        {
            left: 208,
            top: 18
        }
    )

    const sloganPosition = readSavedPosition(
        CUSTOM_POSITION_KEYS.slogan,
        {
            left: Math.round(window.innerWidth * 0.645),
            top: 20
        }
    )

    const style = document.createElement('style')
    style.id = 'custom-top-style'

    style.textContent = `
        /*
         * 返回、刷新按钮固定区域
         */
        #custom-top-buttons {
            position: fixed;
            z-index: 2147483647;

            display: flex;
            align-items: center;
            gap: 8px;

            box-sizing: border-box;

            font-family:
                "Microsoft YaHei",
                "PingFang SC",
                Arial,
                sans-serif;

            user-select: none;
            pointer-events: auto;
        }

        #custom-top-buttons button {
            height: 28px;
            min-width: 62px;
            padding: 0 10px;

            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;

            box-sizing: border-box;

            color: #333333;
            background: rgba(255, 255, 255, 0.98);
            border: 1px solid #d9d9d9;
            border-radius: 5px;

            box-shadow:
                0 1px 4px rgba(0, 0, 0, 0.14),
                0 1px 2px rgba(0, 0, 0, 0.06);

            font-size: 12px;
            font-weight: 400;
            line-height: 1;

            cursor: pointer;
            outline: none;
        }

        #custom-top-buttons button:hover {
            color: #1677ff;
            background: #f0f7ff;
            border-color: #1677ff;
        }

        #custom-top-buttons button:active {
            transform: scale(0.97);
        }

        #custom-top-buttons button:focus-visible {
            border-color: #1677ff;
            box-shadow:
                0 0 0 2px rgba(22, 119, 255, 0.18);
        }

        #custom-top-buttons .custom-nav-icon {
            display: inline-block;
            font-size: 15px;
            line-height: 1;
        }

        /*
         * 红色文字固定区域
         */
        #custom-top-slogan {
            position: fixed;
            z-index: 2147483647;

            width: 620px;
            min-height: 24px;
            padding: 2px 6px;

            box-sizing: border-box;

            color: #ff3030;
            font-family:
                "Microsoft YaHei",
                "PingFang SC",
                Arial,
                sans-serif;
            font-size: 12px;
            font-weight: 500;
            line-height: 20px;
            text-align: center;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            pointer-events: none;
            user-select: none;
        }
    `

    const buttonContainer = document.createElement('div')
    buttonContainer.id = 'custom-top-buttons'
    buttonContainer.style.left = `${buttonPosition.left}px`
    buttonContainer.style.top = `${buttonPosition.top}px`

    const backButton = document.createElement('button')
    backButton.id = 'custom-back-button'
    backButton.type = 'button'
    backButton.title = '返回上一页'
    backButton.setAttribute('aria-label', '返回上一页')

    backButton.innerHTML = `
        <span class="custom-nav-icon">←</span>
        <span>返回</span>
    `

    const refreshButton = document.createElement('button')
    refreshButton.id = 'custom-refresh-button'
    refreshButton.type = 'button'
    refreshButton.title = '刷新当前页面'
    refreshButton.setAttribute('aria-label', '刷新当前页面')

    refreshButton.innerHTML = `
        <span class="custom-nav-icon">↻</span>
        <span>刷新</span>
    `

    const slogan = document.createElement('div')
    slogan.id = 'custom-top-slogan'
    slogan.style.left = `${sloganPosition.left}px`
    slogan.style.top = `${sloganPosition.top}px`

    slogan.textContent =
        '沉下心做好当下事，保持清醒与分寸，长远的收获，从来源于稳步耕耘。'

    backButton.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        console.log('custom back button clicked')

        if (window.history.length > 1) {
            window.history.back()
            return
        }

        if (document.referrer) {
            location.href = document.referrer
            return
        }

        console.log('没有可返回的页面')
    })

    refreshButton.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        console.log('custom refresh button clicked')
        location.reload()
    })

    buttonContainer.appendChild(backButton)
    buttonContainer.appendChild(refreshButton)

    document.head.appendChild(style)
    document.body.appendChild(buttonContainer)
    document.body.appendChild(slogan)

    /**
     * 调整窗口大小时，只防止元素超出屏幕；
     * 不改变你已经确定的位置。
     */
    const correctFixedPosition = () => {
        const buttonsPosition = keepInsideWindow(
            buttonPosition.left,
            buttonPosition.top,
            buttonContainer
        )

        buttonContainer.style.left =
            `${Math.round(buttonsPosition.left)}px`

        buttonContainer.style.top =
            `${Math.round(buttonsPosition.top)}px`

        const textPosition = keepInsideWindow(
            sloganPosition.left,
            sloganPosition.top,
            slogan
        )

        slogan.style.left =
            `${Math.round(textPosition.left)}px`

        slogan.style.top =
            `${Math.round(textPosition.top)}px`
    }

    window.addEventListener('resize', correctFixedPosition)
}

/**
 * 页面加载完成后添加。
 */
if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        addFixedTopContent,
        { once: true }
    )
} else {
    addFixedTopContent()
}