window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug

/**
 * 原有功能：
 * 把 target="_blank" 和 window.open 的链接改为在当前窗口打开。
 */
const hookClick = (event) => {
    const target = event.target

    if (!(target instanceof Element)) {
        return
    }

    // 自定义返回、刷新按钮不参与链接拦截
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
        event.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)

    if (url) {
        location.href = url
    }

    return window
}

document.addEventListener('click', hookClick, { capture: true })

/**
 * 固定位置设置
 *
 * 按钮：固定在左上方第一栏。
 * 文字：固定在顶部中间偏右的位置。
 *
 * 本版不读取 localStorage，因此预览、刷新或重新发布时，
 * 不会因为旧坐标导致文字跑出屏幕。
 */
const CUSTOM_TOP_CONFIG = {
    buttons: {
        left: 225,
        top: 10
    },
    slogan: {
        top: 10,
        leftPercent: 63.5,
        right: 100
    },
    text: '沉下心做好当下事，保持清醒与分寸，长远的收获，从来源于稳步耕耘。'
}

const addFixedTopContent = () => {
    if (!document.head || !document.body) {
        return
    }

    // 清理旧版本残留
    document.getElementById('custom-top-style')?.remove()
    document.getElementById('custom-top-buttons')?.remove()
    document.getElementById('custom-top-slogan')?.remove()

    const style = document.createElement('style')
    style.id = 'custom-top-style'

    style.textContent = `
        #custom-top-buttons {
            position: fixed;
            left: ${CUSTOM_TOP_CONFIG.buttons.left}px;
            top: ${CUSTOM_TOP_CONFIG.buttons.top}px;
            z-index: 2147483647;

            display: flex;
            align-items: center;
            gap: 8px;

            box-sizing: border-box;
            margin: 0;
            padding: 0;

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
            margin: 0;

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

            font-family:
                "Microsoft YaHei",
                "PingFang SC",
                Arial,
                sans-serif;
            font-size: 12px;
            font-weight: 400;
            line-height: 1;

            cursor: pointer;
            outline: none;
            appearance: none;
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
            box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.18);
        }

        #custom-top-buttons .custom-nav-icon {
            display: inline-block;
            font-size: 15px;
            line-height: 1;
        }

        #custom-top-slogan {
            position: fixed;
            top: ${CUSTOM_TOP_CONFIG.slogan.top}px;
            left: ${CUSTOM_TOP_CONFIG.slogan.leftPercent}vw;
            right: ${CUSTOM_TOP_CONFIG.slogan.right}px;
            z-index: 2147483647;

            display: block;
            height: 24px;
            margin: 0;
            padding: 2px 4px;
            box-sizing: border-box;

            color: #ff3030 !important;
            background: transparent !important;

            font-family:
                "Microsoft YaHei",
                "PingFang SC",
                Arial,
                sans-serif;
            font-size: 12px;
            font-weight: 500;
            line-height: 20px;
            text-align: left;

            white-space: nowrap;
            overflow: visible;
            text-overflow: clip;

            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: none;
            user-select: none;
        }

        /*
         * 窗口较窄时，适当向左移动文字并减小字号，
         * 防止文字被右侧按钮遮住。
         */
        @media screen and (max-width: 1600px) {
            #custom-top-slogan {
                left: 58vw;
                right: 120px;
                font-size: 11px;
            }
        }

        @media screen and (max-width: 1250px) {
            #custom-top-slogan {
                left: 52vw;
                right: 70px;
                font-size: 10px;
            }
        }
    `

    const buttonContainer = document.createElement('div')
    buttonContainer.id = 'custom-top-buttons'

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
    slogan.title = CUSTOM_TOP_CONFIG.text
    slogan.textContent = CUSTOM_TOP_CONFIG.text

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
}

/**
 * 某些网页会在加载过程中重新生成页面结构。
 * 这里进行短时间补挂载，避免预览时按钮或文字被页面刷新掉。
 */
const startCustomTopContent = () => {
    addFixedTopContent()

    let retryCount = 0
    const retryTimer = window.setInterval(() => {
        retryCount += 1

        const buttonsExist = document.getElementById('custom-top-buttons')
        const sloganExist = document.getElementById('custom-top-slogan')
        const styleExist = document.getElementById('custom-top-style')

        if (!buttonsExist || !sloganExist || !styleExist) {
            addFixedTopContent()
        }

        if (retryCount >= 20) {
            window.clearInterval(retryTimer)
        }
    }, 500)

    const observer = new MutationObserver(() => {
        if (
            !document.getElementById('custom-top-buttons') ||
            !document.getElementById('custom-top-slogan') ||
            !document.getElementById('custom-top-style')
        ) {
            addFixedTopContent()
        }
    })

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    })
}

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        startCustomTopContent,
        { once: true }
    )
} else {
    startCustomTopContent()
}
