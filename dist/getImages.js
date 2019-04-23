(() => {
    let imgs = document.querySelectorAll('img')

    let arr = [];

    imgs.forEach(v => {
        arr.push({
            src: v.src
        })
    })

    function getTree (el) {
        let tree = [];

        let { tagName } = el;

        if (el.children.length) {
            let newChildren = Array.from(el.children).map(getTree).filter(v => v.length)
            if (newChildren.length)
                tree.push({
                    tagName,
                    children: newChildren,
                })
        } else {
            if (tagName === 'IMG') {
                tree.push({
                    tagName,
                    src: el.src,
                })
            }
        }

        return tree
    }

    chrome.runtime.sendMessage('mhpgfcookabipkaecmgiphaoflclapko', {
        action: 'on-images-got',
        data: arr,
        // doc: getTree(document.body),
    })
})()
