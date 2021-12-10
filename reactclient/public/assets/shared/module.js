let targetedPlane, targetedPanel, socket, socketRetryInterval, garbageBin, htmluiRoot;
let replaceMapNode = [];
let nodeTree = [];
let deletedNodes = [];

const start = (planeType, panelType) => {
    targetedPlane = planeType.toLowerCase();
    targetedPanel = panelType.toLowerCase();
    socketRetryInterval = setInterval(() => {
        connect(panelType);
    }, 2000);

    window.onresize = resizePanel;

    garbageBin = $('#garbageBin');

    // setup MSFS html_ui root folder path
    htmluiRoot = '/assets/' + planeType;

    // ** IMPORTANT ** trim node tree on set interval (eg. constant add/remove nodes create a bunch of orphan references)
    setInterval(() => {
        trimNodeTree();
        clearGarbageBin();
    }, 5000)
}

const connect = (panel) => {
    console.log('Connecting to plane...')
    fetch('http://' + window.location.hostname + ':5001' + '/getdebuggerpagelist')
        .then(
            (response) => { 
                if(response.status === 200)
                    return response.json(); 
            })
        .then(
            data => 
            { 
                if(data !== undefined && data.length > 0)
                {
                    data.forEach(page => {
                        if(page.title.toLowerCase().includes(panel.toLowerCase()))
                        {
                            // Create WebSocket connection.
                            socket = new WebSocket('ws://' + window.location.hostname + ':19999/devtools/page/' + page.id);
                            
                            socket.onmessage = (msg) => socketReceivedMessage(msg);

                            socket.onopen = () => {
                                console.log('Server connected!');
                                clearInterval(socketRetryInterval);    // found first node, clear websocket connection retry
                                getDocument();
                            };                         
                        }
                    });
                }
            }
        ).catch();
}

const resizePanel = () => {
    let body = document.getElementById('container');
    let vcockpit = document.getElementById('panel');

    if(vcockpit !== null) {
        let pageWidth = parseInt(vcockpit.childNodes[0].style.width, 10);
        let pageHeight = parseInt(vcockpit.childNodes[0].style.height, 10);

        let zoomLevelWidth = (parseInt(window.innerWidth) / pageWidth * 1.0 - 1) * 100;
        let zoomLevelHeight = (parseInt(window.innerHeight) / pageHeight * 1.0 - 1) * 100;
        let zoomLevel = zoomLevelWidth < zoomLevelHeight ? zoomLevelWidth : zoomLevelHeight;

        let zoom = (100 + zoomLevel).toFixed(2) + '%';
        body.style.zoom = zoom;
    }

    return false;
}

const socketReceivedMessage = (msg) => {
    let message = JSON.parse(msg.data);

    if (message.result !== undefined) 
        executeResultMessage(message);
    else if (message.method !== undefined) 
        executeMethodMessage(message)
}

const executeResultMessage = (data) => {
    if (data.id >= 10) {
        setElementAttributes(data.id, getNodeById(data.id), data.result.attributes);
    }
    else if (data.id === 2) {
        createRootElement(data.result);
    }
    else if (data.id === 3) {
        let rootNodeId = data.result.nodeId;
        createDocument(rootNodeId);
    }
}

const executeMethodMessage = (data) => {
    switch(data.method)
    {
        case 'DOM.inlineStyleInvalidated':
            handleInlineStyleInvalidated(data.params);
            break;
        case 'DOM.attributeModified':
            handleAttributeModified(data.params);
            break;
        case 'DOM.attributeRemoved':
            handleAttributeRemoved(data.params);
            break;
        case 'DOM.childNodeInserted':
            handleInsertNode(data.params);
            break;
        case 'DOM.childNodeRemoved':
            handleRemoveElement(data.params);
            break;
        case 'DOM.characterDataModified':
            handleCharacterDataModified(data.params);
            break;
        case 'DOM.setChildNodes':
            let parent = getNodeById(data.params.parentId);
            data.params.nodes = data.params.nodes.filter(childNode => childNode.localName !== 'script' && childNode.localName !== 'title' && childNode.localName !== 'meta');

            if (parent !== undefined) {
                let isBodyTag = data.params.parentId === Number(document.body.getAttribute('name'));

                // only get first child of body element or DOM recursive loop will crash the page
                if(isBodyTag)
                    data.params.nodes.length = 1;

                let frag = document.createDocumentFragment();

                data.params.nodes.forEach((node) => {
                    frag.appendChild(createTagElement(node, data.params.parentId, parent.tagName));
                });

                if(data.params.nodes.length > 0)
                {
                    if(isBodyTag)
                        parent.replaceChild(frag, document.getElementById('loadingPanel'))
                    else
                        parent.appendChild(frag);
                }

                forceRerender(data.params.parentId);  // force rerender
            }
            break;
        case 'DOM.childNodeCountUpdated':
            handleChildNodeCountUpdated(data.params);
            break;
        case 'DOM.pseudoElementAdded':   
        case 'DOM.pseudoElementRemoved':
            break;
        default:
            //console.log(data);
    }
}


const getDocument = () => {
    socket.send(JSON.stringify({id: 2, method: 'DOM.getDocument'}));
    socket.send(JSON.stringify({id: 3, method: 'DOM.pushNodeByPathToFrontend', params: { path: '1,HTML'}}));
}

const createDocument = (nodeId) => {
    // expand all nodes
    socket.send(JSON.stringify({id: 4, method: "DOM.requestChildNodes", params: { nodeId: nodeId, depth: -1 }}));

    setTimeout(() => {
        resizePanel();

        // fix g1000nxi scolling highlighted item into view causes entire page to move
        let mainFrame = document.getElementById('Mainframe');
        if(mainFrame !== null) 
            mainFrame.setAttribute('style', 'overflow: clip');
    }, 1000)
}

const createRootElement = (data) => {
    let htmlNode = data.root.children[1];
    let htmlElement = $('html')[0]; 
    setElementAttributes(0, htmlElement, htmlNode.attributes);
        
    htmlNode.children.forEach(childNode =>
    {
        if(childNode.localName === 'head')
        {
            document.head.setAttribute('name', childNode.nodeId);
            addNodeToTree(1, childNode.nodeId, document.head);
        }
        else if (childNode.localName === 'body')
        {
            document.body.setAttribute('name', childNode.nodeId);
            addNodeToTree(1, childNode.nodeId, document.body);
        }
    })
}

const createTagElement = (node, parentNodeId, parentTag) => {
    if(node.nodeType === 3)
    {
        if(targetedPlane === 'fbwa32nx' && targetedPanel === 'eicas_1') // one off for FBW A32NX and EICAS_1
        {
             return node.nodeValue;
        }

        if(parentTag.toLowerCase() === 'text' || parentTag.toLowerCase() === 'tspan')
        {
            if(targetedPlane === 'fbwa32nx' || targetedPlane === 'g1000nxi')        // one off for FBW A32NX and G1000NXi
            {
                let element = createSpecificElement('tspan');
                element.setAttribute('name', node.nodeId);
                element.textContent = node.nodeValue;
                addNodeToTree(parentNodeId, node.nodeId, element);
                return element;
            }
            else
            {
                return node.nodeValue;
            }
        }

        let element = createSpecificElement('place-holder');
        element.setAttribute('name', node.nodeId);
        element.textContent = node.nodeValue;
        addNodeToTree(parentNodeId, node.nodeId, element);
        return element;        
    }

    if(node.nodeType === 1)
    {
        if(node.childNodeCount !== undefined && node.childNodeCount >= 1)
        {
            socket.send(JSON.stringify({id: node.nodeId, method: "DOM.requestChildNodes", params: { nodeId: node.nodeId, depth: -1 }}));
        }

        let element = createSpecificElement(node.localName);
        element.setAttribute('name', node.nodeId);
        setElementAttributes(node.nodeId, element, node.attributes);
        addNodeToTree(parentNodeId, node.nodeId, element);

        // replace bing map node with built-in map app
        let mapNode = replaceMapNode.find(x => x.nodeId === node.nodeId);
        if(mapNode !== undefined)
        {
            let mapElement = createSpecificElement('iframe');
            mapElement.setAttribute('frameborder', '0');

            switch(mapNode.type)
            {
                case 'full':
                    mapElement.setAttribute('style', 'width:100%; height: calc(100% - 58px); margin-top: 58px');
                    mapElement.setAttribute('src',  `http://${window.location.hostname}:${window.location.port}/mappanel/full`);
                    break;
                case 'waypoint':
                    mapElement.setAttribute('style', 'width:100%; height:100%');
                    mapElement.setAttribute('src',  `http://${window.location.hostname}:${window.location.port}/mappanel/waypoint`);
                    break;
                case 'inset':
                             mapElement.setAttribute('style', 'width:100%; height:100%');
                    mapElement.setAttribute('src',  `http://${window.location.hostname}:${window.location.port}/mappanel/inset`);
                    break;
            }
            
            element.append(mapElement);
            return element;
        }
        
        if(node.children !== undefined && node.children.length > 0)
        {
            node.children = node.children.filter(n => n.localName !== 'script');
            node.children.forEach(childNode => {
                let newElement = createTagElement(childNode, node.nodeId, node.localName)

                if(typeof newElement === 'string')
                    element.textContent = newElement;
                else
                    element.append(newElement);
            
            });
        }

        if(targetedPlane === 'fbwa32nx' && targetedPanel === 'eicas_1')     // one off for FBW A32NX and EICAS_1
        {
           return element;
        }
        else{
            socket.send(JSON.stringify({id: node.nodeId, method: 'DOM.getAttributes', params: {nodeId: node.nodeId }}));
            return element;
        }
    }

    if (node.nodeType === 8)
    {
        return node.nodeValue;
    }

    return null;
}

const createSpecificElement = (tag) => {
    // *** Another gotcha here **** 
    // SVG tag without namespace will not render without forcing full page refresh with element.innerHTML() += ''. But by using in
    // it, it will break all existing DOM refrences. This is to fix that!

    switch(tag)
    {
        case 'svg':
        case 'g':
        case 'text':
        case 'tspan':
            return document.createElementNS("http://www.w3.org/2000/svg", tag);
        default:
            return document.createElement(tag);
    }
}

const setElementAttributes = (nodeId, element, attributes) => {
    if(element !== undefined && attributes !== undefined)
    {
        let i = 0;
        while (i < attributes.length) {
            let attribute = attributes[i].toLowerCase();
            let value = attributes[i + 1];
            switch(attribute)
            {
                case 'class':   
                    // scoll highlighted item into view
                    if(value.includes('highlight-select'))
                    {
                        element.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});

                        // fix ipad safari screen shift when scrollIntoView
                        let mainframe = document.getElementById('Mainframe');
                        if(mainframe !== null)
                            setTimeout(() => mainframe.scrollIntoView({block: 'start', inline: 'end'}), 1000);
                    }
                    else if (value.includes('mfd-navmap') || value.includes('mfd-fplmap'))  // replace G1000NXi MFD bing map with map from app
                    {
                        replaceMapNode.push({nodeId: nodeId, type: 'full'});
                    }
                    else if (value.includes('waypoint-map'))  // replace G1000NXi MFD waypoint bing map with map from app
                    {
                        replaceMapNode.push({nodeId: nodeId, type: 'waypoint'});
                    }
                    else if (value.includes('pfd-insetmap'))      // replace G1000NXi PFD inset bing map with map from app
                    {
                        replaceMapNode.push({nodeId: nodeId, type: 'inset'});
                    }
                    break;
                case 'src':
                case 'url':
                case 'href':
                    if(value === '' || value.includes('JS_BINGMAP'))
                    {
                        value = '/assets/empty.png';
                    }
                    else
                    {
                        if(value.toLowerCase().startsWith('/pages'))
                            value = value.toLowerCase().replace(/\/pages/gi, 'html_ui/pages');

                        value = value.replace('coui://', '');
                        value = value.replace(/html_ui/gi, htmluiRoot + '/html_ui');
                        value = value.replace(/scss/gi, 'assets/shared/scss');
                    }
                    break;
                case 'xlink:href':
                    value = value.replace(/Images/gi, 'assets/shared/images/');
                    break;
                default:
            }

            if(element.getAttribute(attribute) !== value)
                element.setAttribute(attribute, value);
            
            i += 2;
        }
    }
}

const handleRemoveElement = (data) => {
    // let parentNode = getNodeById(data.parentNodeId);
    // let node = getNodeById(data.nodeId);
    // if(parentNode !== undefined && node !== undefined)
    //     parentNode.removeChild(node);

    deletedNodes.push(data.nodeId);
}

const handleInsertNode = (data) => {
    let parent = getNodeById(data.parentNodeId);

    if (data.node.nodeType === 3)
    {
        if(data.node.nodeValue.match(/{(.*?)}/)) return;   // ignore messed up data issue in fbwA32nx CDU  (eg. {cyan}113{end}{small}   {end} F={green}131{end})
        
        let newElement = createTagElement(data.node, data.parentNodeId, parent.tagName);
        if(typeof newElement === 'string') {
            if(parent.textContent !== newElement)
                parent.textContent = newElement;
        }
        else
            parent.prepend(newElement);
    }
    else if (data.node.nodeType === 1) {
        let newElement = createTagElement(data.node, data.parentNodeId, parent.tagName);
        if(typeof newElement === 'string'){
            if(parent.textContent !== newElement)
                parent.textContent = newElement;
        }
        else
            parent.append(newElement);
    }

    
    // remove node here instead of in handleRemoveElement method to prevent screen flickering
    trimNodeTree();
}

const handleInlineStyleInvalidated = (data) => {
    data.nodeIds.forEach((nodeId) => {
        socket.send(JSON.stringify({id: nodeId, method: 'DOM.getAttributes', params: {nodeId: nodeId }}));
    });
}

const handleAttributeModified = (data) => {
    let node = getNodeById(data.nodeId);
    
    if(node !== undefined)
        setElementAttributes(data.nodeId, node, [data.name, data.value]);
}

const handleAttributeRemoved = (data) => {
    let node = getNodeById(data.nodeId);
    
    if(node !== undefined)
        node.removeAttribute(data.name);
}

const handleCharacterDataModified = (data) => {
    let element = getNodeById(data.nodeId);

    if(element !== undefined && element.textContent !== data.characterData)
        element.textContent = data.characterData;
}

const handleChildNodeCountUpdated = (data) => {
    let msg = {
        id: 1,
        method: "DOM.requestChildNodes",
        params: { nodeId: data.nodeId, depth: -1 }
    }
    socket.send(JSON.stringify(msg));
}

const forceRerender = (nodeId) => {
    let element = getNodeById(nodeId);
    if(element !== undefined)
        element.innerHTML += '';
    
    // reset node tree recursively since by doing innerHTML above will remove all node references
    refreshNodeTree(nodeId);
}

const refreshNodeTree = (nodeId) => {
    let nodes = nodeTree.filter(x => x.parentNodeId === nodeId);
    for(let i = 0; i < nodes.length; i++)
    {
        nodeTree.find(x => x.nodeId === nodes[i].nodeId).node = $('[name=' + nodes[i].nodeId + ']')[0];
        refreshNodeTree(nodes[i].nodeId);
    }
}

const trimNodeTree = () => {
    for(let i = 0; i < deletedNodes.length; i++)
    {
        garbageBin.append(getNodeById(deletedNodes[i]));
    }

    nodeTree = nodeTree.filter(n => !deletedNodes.includes(n.nodeId));
    deletedNodes.length = 0;        // clear deleted node list
}

const clearGarbageBin = () => {
    garbageBin.innerHTML = '';      
}

const getNodeById = (nodeId) => {
    let node = nodeTree.find(x => x.nodeId === nodeId);
    if(node !== undefined)
        return node.node;

    return undefined;
}

const addNodeToTree = (parentNodeId, nodeId, node) => {
    if(nodeTree.indexOf(nodeId) === -1)
        nodeTree.push({parentNodeId: parentNodeId, nodeId: nodeId, node: node});
}